import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.css']
})
export class CastVoteComponent implements OnInit {

  pollCastForm: FormGroup;

  title: string;
  options: any = [];
  id: string;
  pollFound = false;
  isSecure: Boolean;

  constructor(private authService: AuthenticationService,
              private route: ActivatedRoute,
              private fb: FormBuilder
  ) { }

  ngOnInit() {
    const pollid = this.route.snapshot.paramMap.get('id');
    console.log(pollid);
    this.authService.getPollInformation(pollid)
      .subscribe((response) => {
        this.title = response.title;
        this.options = response.options;
        this.id = response.id;
        this.isSecure = response.isSecure;
        this.pollFound = true;
      });

      this.pollCastForm = this.fb.group({
        voteOption: [''],
        privKey: ['']
      });
  }

  submit() {
    console.log(this.pollCastForm.controls);
    if (this.pollCastForm.controls['voteOption'].value !== '') {
      const voteObject = {
        pollid: this.id,
        option: this.pollCastForm.controls['voteOption'].value,
      };
      this.authService.castVote(voteObject);
    }
  }

}
