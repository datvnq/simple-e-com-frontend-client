import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/common/user';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  user: User = new User();
  signUpFormGroup: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.signUpFormGroup = this.formBuilder.group({
      signUp: this.formBuilder.group({
        username: new FormControl('', {
          validators: [Validators.required, Validators.minLength(4), CustomValidators.notOnlyWhiteSpace()], 
          asyncValidators: [CustomValidators.usernameValidator(this.authService)]
        }),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        password: new FormControl('', [Validators.required])
      })
    });
  }

  get username() {
    return this.signUpFormGroup.get('signUp.username');
  }
  get email() {
    return this.signUpFormGroup.get('signUp.email');
  }
  get password() {
    return this.signUpFormGroup.get('signUp.password');
  }

  signUp() {
    if (this.signUpFormGroup.invalid) {
      this.signUpFormGroup.markAllAsTouched();
    }

    this.authService.signUp(this.user).subscribe(
      data => {
        this.router.navigate(['/login']);
      }
    );
  }

}
