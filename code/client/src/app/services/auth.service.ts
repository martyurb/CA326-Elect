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

    constructor(
        private _http: HttpClient,
        private _router: Router,
    ) {}

    login(email: string, id_token: string) {
        const loginCredentials = {email, id_token};
        this._http.post<{token: string, expiresIn: number}>(this._apiAuth + this._apiLogin, loginCredentials)
            .subscribe(response => {
                console.log(response);
            });
    }


}