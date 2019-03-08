import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import * as pgp from 'openpgp';

@Component({
  selector: 'app-cast-vote',
  templateUrl: './cast-vote.component.html',
  styleUrls: ['./cast-vote.component.css']
})
export class CastVoteComponent implements OnInit {

  pollCastForm: FormGroup;

  encrypted;

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
      if (this.isSecure === false) {
        const voteObject = {
          pollid: this.id,
          option: this.pollCastForm.controls['voteOption'].value,
        };
        this.authService.castVote(voteObject);
      } else {
        const voteObject = {
          pollid: this.id,
          option: this.pollCastForm.controls['voteOption'].value,

        };

const pubkey = ['-----BEGIN PGP PUBLIC KEY BLOCK-----',
'Version: OpenPGP.js v4.4.7',
'Comment: https://openpgpjs.org',
'',
'xo0EXG2S4AEEAKLuf7vp/1ZdYfMHXa+jVq4WArM4bCgiO+AfyBpNWBbaXdjv',
'e8ObBdDy2ZGMWByDUBKkLKq08c4vLDG5nfhTGlRQ68Kuk4hyoxaBvshYEZxO',
'9ZkSTQl/StbEBVy4kA8ZI9v44O7iJVvlfLu1FwAF9UTvfxOXb5SSSDF9TxwG',
'0t53ABEBAAHNAMK1BBABCAAfBQJcbZLgBgsJBwgDAgQVCAoCAxYCAQIZAQIb',
'AwIeAQAKCRCtq+Andixrcy+aA/4sUm8rAWEVdNIInHXjaXMbe1YbYtvHmayM',
'+0AbfAtEUBVMSvr0bgO0TVA2x5I+fkVO4vfGhwi5AivRbUizt8OEuUt/XvEo',
'0d5TMhT8+mLzFwW9Mzt5LY7pLL//tuK3gLyLA1UULPIZQFDFs5Q4K/ELLyzc',
'Iows04P98/A1sVzV486NBFxtkuABA/9OMbIu29YbxfMc0sfCS/+t9OqUZvx9',
'D3Wm6bSL92521hSyz1cXkyymkxMZb8DLpYWtt8llZWUgMqbgQW1QcywifNl7',
'0u6mh9kV7mAlO+VgRbRPjoiT1akmQNdDw3vEoQQva4GGOGPTeiJrZUCxwb+U',
'ybZUo60GiRtUJb8K2RIqpwARAQABwp8EGAEIAAkFAlxtkuACGwwACgkQravg',
'J3Ysa3PQTQP/TUR1rb3+7YvT/YsBA/ubyItmXAOaxXK8/9Ta93NNizfeNzh1',
'ljQgcuJFoXKkHcz1IFLxnXVOwTEI6TsC7mXI9chUgca9+KIqCTHF8bz+2IPV',
'P0lx4PJcdhIn7+voq5X+4S8GFPGO4viyvX27OlaDjadbGHPDbKvJ1VIy/k6v',
'D88=',
'=HZmp',
'-----END PGP PUBLIC KEY BLOCK-----'].join('\r\n');

        const privkey = this.pollCastForm.controls['privKey'].value;

        console.log(privkey);

        const privKeyObj = (pgp.key.readArmored(privkey));
        privKeyObj.keys[0].decrypt('oiwerl43ksmpoq5wieurxmzcvnb9843lj3459ks');

        // FOR SIGNING THE VOTE
        const options = {
          data: voteObject.option,
          privateKeys: privKeyObj.keys[0],
        };

        pgp.sign(options).then((signed) => {
          const cleartext = signed.data;
          console.log(cleartext);

          const eoptions = {
            data: cleartext,
            publicKeys: pgp.key.readArmored(pubkey).keys
          };

          pgp.encrypt(eoptions).then((ciphertext) => {
            this.authService.castSecure(ciphertext, this.id);
          });
        });
      }

    }
  }

}
