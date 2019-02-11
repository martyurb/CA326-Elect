import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.pollForm = this.fb.group({
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
    console.log(this.pollForm);
    console.log(this.pollForm.controls);
  }


}
