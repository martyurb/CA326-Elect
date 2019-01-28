import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../services/auth.service';
import { AuthService, AuthServiceConfig, GoogleLoginProvider} from 'angular-6-social-login-v2';
import { SigninComponent } from './signin.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let testService: AuthenticationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationService, HttpClient, HttpHandler, AuthService, ],
      declarations: [ SigninComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
