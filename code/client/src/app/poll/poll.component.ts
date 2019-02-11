import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';

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
  }]

  constructor(private fb: FormBuilder, private authService: AuthenticationService) { }

  ngOnInit() {
    this.pollForm = this.fb.group({
      timestamp: [''],
      title: [''],
      type: [this.voteTypes[0]],
      options: this.fb.array([
        this.fb.control('')
      ])
    })
  }

  get options() {
    return this.pollForm.get('options') as FormArray;
  }

  addOption(name: string) {
    this.options.push(this.fb.control(''));
  }

  submit() {
    this.pollForm.controls['timestamp'].patchValue(Date.now());
    let timestamp = this.pollForm.controls.timestamp.value;
    let title = this.pollForm.controls.title.value;
    let type = this.pollForm.controls.type.value;
    let options = this.pollForm.controls.options.value;

    let newOptions = [];
    let i = 0;
    while (i < options.length) {
      if (options[i] !== "") {
        newOptions.push(options[i]);
      }
      i++;
    }
    options = newOptions;
    
    const poll = {
      timestamp: timestamp,
      title: title,
      type: type,
      options: options
    };

    this.authService.createPoll(poll);
  }


}
