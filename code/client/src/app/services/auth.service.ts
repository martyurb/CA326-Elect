import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AppConfig } from '../config/api-config';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private _baseUrl = AppConfig.apiAuth;
    private _apiLogin = AppConfig.apiLogin;
    private _apiSignup = AppConfig.apiSignup;
    private _apiAuth = AppConfig.apiAuth;

    private _isAuthenticated = false;
    private _token: string;
    private _tokenTimer: any;
    private _authenticationStatusListener = new Subject<boolean>();

    constructor(
        private _http: HttpClient,
        private _router: Router,
    ) {}

    getToken() {
        return this._token;
    }
    
    getIsAuthenticated() {
        return this._isAuthenticated;
    }

    getAuthStatusListener() {
        return this._authenticationStatusListener.asObservable();
    }

    login(email: string, id_token: string, userid:string) {
        const loginCredentials = {email, id_token, userid};
        this._http.post<{token: string, expiresIn: number, userid: string}>(this._apiAuth + this._apiLogin, loginCredentials)
            .subscribe(response => {
                console.log(response);
                const token = response.token;
                this._token = token;
                if (token) {
                    const expiresInDuration = response.expiresIn;
                    this.setAuthTimer(expiresInDuration);
                    this._authenticationStatusListener.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                    this.saveAuthenticationData(token, expirationDate, response.userid);
                    this._router.navigate(["/"]);
                }
            });
    }

    autoAuthUser() {
        const authInformation = this.getAuthenticationData();
        if (!authInformation) {
            return;
        }
        const now = new Date();
        const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this._token = authInformation.token;
            this._isAuthenticated = true;
            this.setAuthTimer(expiresIn/1000);
            this._authenticationStatusListener.next(true);
        }
    }

    logout() {
        this._token = null;
        this._isAuthenticated = false;
        this._authenticationStatusListener.next(false);
        this.clearAuthenticationData();
        clearTimeout(this._tokenTimer);
    }


    private setAuthTimer(duration: number) {
        this._tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    private saveAuthenticationData(token: string, expirationDate: Date, id: string) {
        localStorage.setItem('token', token);
        localStorage.setItem('expiration', expirationDate.toISOString());
        localStorage.setItem('uid', id);
    }

    private clearAuthenticationData() {
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('uid');
    }

    private getAuthenticationData() {
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        };
    }
}