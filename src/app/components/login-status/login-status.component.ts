import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  username: string;

  constructor(private cartService: CartService, private route: Router) { }

  ngOnInit(): void {
  }

  loginStatus() {
    this.username = localStorage.getItem('token');
    return this.username;
  }

  logout() {
    localStorage.removeItem('token');
    this.resetCart();
    this.route.navigate(['/products']);

  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
  }

}
