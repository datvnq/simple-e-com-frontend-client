import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { ShippingMethod } from 'src/app/common/shipping-method';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { CustomValidators } from 'src/app/validators/custom-validators';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Customer } from 'src/app/common/customer';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  countries: Country[] = [];
  states: State[] = [];

  shippingMethod: ShippingMethod[] = [new ShippingMethod(32, "FedEx"),
                                      new ShippingMethod(15, "DHL")];

  shippingPrice: number = 0;

  constructor(private formBuilder: FormBuilder,
    private checkoutService: CheckoutService,
    private cartService: CartService,
    private router: Router,
    private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      billingInfo: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        email: new FormControl('', [Validators.required, Validators.email]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0]{1}[0-9]{9}$')]),
        address: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
      }),
      paymentMethod: this.formBuilder.group({
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        cardHolder: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        expirationMonth: new FormControl('', [Validators.required]),
        expirationYear: new FormControl('', [Validators.required]),
        cardType: new FormControl('', [Validators.required])
      }),
      additionalInfo: this.formBuilder.group({
        notes: ['']
      })
    });

    const startMonth: number = new Date().getMonth() + 1;
    this.checkoutService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );

    this.checkoutService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );

    this.checkoutService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );

    this.cartTotal();

  }

  cartTotal() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(
      data => {
        this.totalPrice = data;
      }
    );

    this.cartService.totalQuantity.subscribe(
      data => {
        this.totalQuantity = data;
      }
    );

    this.cartService.computeCartTotals();
  }

  handleShippingMethod(item: ShippingMethod) {
    if (this.cartItems.length > 0) {
      this.shippingPrice = item.price;
    }
    else {
      this.shippingPrice = 0;
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('paymentMethod');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    let startMonth: number;

    if(currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.checkoutService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  getStates() {
    const countryCode = this.checkoutFormGroup.get('billingInfo').value.country.code;
    this.checkoutService.getStates(countryCode).subscribe(
      data => {
        this.states = data;
      }
    );
    this.checkoutFormGroup.get('billingInfo.state').setValue(this.states[0]);
  }

  onSubmit() {
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let purchase = new Purchase();
    purchase.customer = new Customer();

    purchase.customer.firstName = this.checkoutFormGroup.get('billingInfo.firstName').value;
    purchase.customer.lastName = this.checkoutFormGroup.get('billingInfo.lastName').value;
    purchase.customer.email = this.checkoutFormGroup.get('billingInfo.email').value;
    purchase.customer.phoneNumber = this.checkoutFormGroup.get('billingInfo.phoneNumber').value;

    let order = new Order();
    order.totalPrice = this.totalPrice + this.shippingPrice;
    order.totalQuantity = this.totalQuantity;
    order.address = this.checkoutFormGroup.get('billingInfo.address').value;
    order.city = this.checkoutFormGroup.get('billingInfo.city').value;
    order.country = this.checkoutFormGroup.get('billingInfo.country').value.name;
    order.state = this.checkoutFormGroup.get('billingInfo.state').value.name;
    order.zipCode = this.checkoutFormGroup.get('billingInfo.zipCode').value;
    order.note = this.checkoutFormGroup.get('additionalInfo.notes').value;
    purchase.order = order;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    purchase.orderItems = orderItems;

    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response => {
          this.notification.success('Your order has been received', `Order tracking number: ${response.orderTrackingNumber}`);
          this.resetCart();
        },
        error: err => {
          this.notification.error('There was an error', `${err.message}`);
        }
      }
    );
  }

  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkoutFormGroup.reset();
    this.router.navigateByUrl("/products");
  }

  get firstName() { return this.checkoutFormGroup.get('billingInfo.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('billingInfo.lastName'); }
  get email() { return this.checkoutFormGroup.get('billingInfo.email'); }
  get phoneNumber() { return this.checkoutFormGroup.get('billingInfo.phoneNumber'); }
  get address() { return this.checkoutFormGroup.get('billingInfo.address'); }
  get city() { return this.checkoutFormGroup.get('billingInfo.city'); }
  get country() { return this.checkoutFormGroup.get('billingInfo.country'); }
  get state() { return this.checkoutFormGroup.get('billingInfo.state'); }
  get zipCode() { return this.checkoutFormGroup.get('billingInfo.zipCode'); }
  get cardNumber() { return this.checkoutFormGroup.get('paymentMethod.cardNumber'); }
  get cardHolder() { return this.checkoutFormGroup.get('paymentMethod.cardHolder'); }
  get expirationDate() { return this.checkoutFormGroup.get('paymentMethod.expirationDate'); }
  get cardType() { return this.checkoutFormGroup.get('paymentMethod.cardType'); }
  get notes() { return this.checkoutFormGroup.get('additionalInfo.notes'); }

}
