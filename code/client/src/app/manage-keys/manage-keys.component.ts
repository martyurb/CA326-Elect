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
  keyText = '';
  keysForm: FormGroup;
  showKey = false;
  keyGenerated = false;
  privKey = '';
  public isKeySet;
  private key;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    ) { }

  ngOnInit() {

    // Initialise the RSA Key upload form
    this.keysForm = this.formBuilder.group({
      publicKey: ['']
    });

    // Check if the users key is set
    this.authService.isKeySet()
      .subscribe((response) => {
        if (response.isKeySet) {
          this.isKeySet = true;
          this.key = response.key;
          this.publicKeyEnding = '****' + response.key.slice(response.key.length - 4, response.key.length);
        }
      });
  }

  // Display the users key
  displayKey() {
    this.showKey = true;
    this.keyText = this.key;
  }

  // Call authentication service to generate encryption key pair
  generateKey() {
    this.authService.generateKey(this.authService.getToken())
      .subscribe(response => {
        console.log(response);
        const pkey = response.privKey;
        const lines = pkey.split('\n');
        for (let i = 0; i < lines.length; i++) {
          lines[i].replace(/(\r\n|\n|\r)/gm, '');
        }
        this.privKey = lines.join('');
        this.keyGenerated = true;
      });
  }

  // Set public key when form is submitted
  onSubmit(keyForm) {
    this.isLoading = true;

    if (this.keysForm.get('publicKey').value !== '') {
      this.authService.setKey(this.keysForm.get('publicKey').value);
    }
  }

}
