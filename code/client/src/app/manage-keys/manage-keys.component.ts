import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-manage-keys',
  templateUrl: './manage-keys.component.html',
  styleUrls: ['./manage-keys.component.css']
})
export class ManageKeysComponent implements OnInit {

  isLoading = false;
  publicKeyEnding = '';
  keyText = "";
  keysForm: FormGroup;
  showKey = false;
  public isKeySet;
  private key;
  

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    ) { }

  ngOnInit() {
    this.keysForm = this.formBuilder.group({
      publicKey: ['']
    });

    this.authService.isKeySet()
      .subscribe((response) => {
        if (response.isKeySet) {
          this.isKeySet = true;
          this.key = response.key;
          this.publicKeyEnding = "****" + response.key.slice(response.key.length-4, response.key.length);
        }
      })
  }

  displayKey() {
    this.showKey = true;
    this.keyText = this.key;
  }

  copyToClipboard(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  generateKey() {
    this.authService.generateKey(this.authService.getToken())
      .subscribe(privatekey => {
        console.log(privatekey);
      })
  }

  onSubmit(keyForm) {
    this.isLoading = true;

    if (this.keysForm.get("publicKey").value != "") {
      this.authService.setKey(this.keysForm.get("publicKey").value);
    }
  }

}
