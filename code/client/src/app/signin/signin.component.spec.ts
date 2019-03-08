import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../services/auth.service';
import { AuthService, GoogleLoginProvider, AuthServiceConfig} from 'angular-6-social-login-v2';
import { getAuthServiceConfigs} from '../app.module';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { SigninComponent } from './signin.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  // let testService: AuthenticationService;
  const config = getAuthServiceConfigs();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, AuthServiceConfig],
      declarations: [ SigninComponent ],
      imports: [RouterTestingModule, HttpClientTestingModule]
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
