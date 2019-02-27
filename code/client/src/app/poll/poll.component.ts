import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {

  pollForm: FormGroup;

  voteTypes = [{
    code: 1,
    name: 'Straw Poll'
  }, {
    code: 2,
    name: 'Majority Wins'
  }];

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private _router: Router) { }

  ngOnInit() {
    this.pollForm = this.fb.group({
      timestamp: [''],
      title: [''],
      type: [this.voteTypes[0]],
      options: this.fb.array([
        this.fb.control('')
      ]),
      isExtraSecure: ['']
    });
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption() {
    this.options.push(this.fb.control(''));
  }

  submit() {

    this.pollForm.controls['timestamp'].patchValue(Date.now());
    const timestamp = this.pollForm.controls.timestamp.value;
    const title = this.pollForm.controls.title.value;
    const type = this.pollForm.controls.type.value;
    let options = this.pollForm.controls.options.value;
    let secure: Boolean;
    if (this.pollForm.controls.isExtraSecure.untouched === true) {
      secure = false;
    } else {
      secure = this.pollForm.controls.isExtraSecure.value;
    }
    console.log(secure);
    const newOptions = [];
    let i = 0;
    while (i < options.length) {
      if (options[i] !== '') {
        newOptions.push(options[i]);
      }
      i++;
    }
    options = newOptions;

    const poll = {
      timestamp: timestamp,
      title: title,
      type: type,
      options: options,
      isSecure: secure,
    };

    console.log(poll);

    this.authService.createPoll(poll)
      .subscribe((response) => {
        if (response.message === true) {
          this._router.navigate(['/poll/', response.pollid]);
        }
      });


  }


}
