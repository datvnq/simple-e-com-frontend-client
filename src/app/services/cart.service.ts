import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(cartItem: CartItem) {
    let alreadyExist: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id == cartItem.id );
      alreadyExist = (existingCartItem != undefined);
    }

    if (alreadyExist) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(cartItem);
    }

    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let tempCartItem of this.cartItems) {
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    if (cartItem.quantity == 0) {
      this.remove(cartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(cartItem: CartItem) {
    const cartItemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id == cartItem.id );
    if (cartItemIndex > -1) {
      this.cartItems.splice(cartItemIndex, 1);
      this.computeCartTotals();
    } 
  }
}
