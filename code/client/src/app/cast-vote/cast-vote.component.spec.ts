import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { CastVoteComponent } from './cast-vote.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('CastVoteComponent', () => {
  let component: CastVoteComponent;
  let fixture: ComponentFixture<CastVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastVoteComponent ],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
