import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage = 'Invalid Credentials';
  invalidLogin = false;
  loginSuccess = false;

  loginFormGroup: FormGroup;

  constructor(private authService: AuthService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private cartService: CartService) { }

  ngOnInit(): void {
    this.loginFormGroup = this.formBuilder.group({
      login: this.formBuilder.group({
        loginUsername: new FormControl('', [Validators.required]),
        loginPassword: new FormControl('', [Validators.required])
      })
    });
  }

  get loginUsername() {
    return this.loginFormGroup.get('login.loginUsername');
  }
  get loginPassword() {
    return this.loginFormGroup.get('login.loginPassword');
  }

  login() {
    if (this.loginFormGroup.invalid) {
      this.loginFormGroup.markAllAsTouched();
    }

    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        this.invalidLogin = false;
        this.loginSuccess = true;
        localStorage.setItem('token', this.username);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.invalidLogin = true;
        this.loginSuccess = false;
        alert("The username or password is incorrect");
      }
    });

    this.resetCart();
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
  }

}
