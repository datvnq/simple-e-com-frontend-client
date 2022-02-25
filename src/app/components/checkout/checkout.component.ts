import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      billingInfo: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0]{1}[0-9]{9}$')]),
        address: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        country: new FormControl('', [Validators.required, CustomValidators.notOnlyWhiteSpace()]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
      }),
      paymentMethod: this.formBuilder.group({
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        cardHolder: new FormControl('', [Validators.required, Validators.minLength(2), CustomValidators.notOnlyWhiteSpace()]),
        expirationDate: [''],
        cardType: new FormControl('', [Validators.required])
      }),
      additionalInfo: this.formBuilder.group({
        notes: ['']
      })
    });
  }

  get firstName() { return this.checkoutFormGroup.get('billingInfo.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('billingInfo.lastName'); }
  get email() { return this.checkoutFormGroup.get('billingInfo.email'); }
  get phoneNumber() { return this.checkoutFormGroup.get('billingInfo.phoneNumber'); }
  get address() { return this.checkoutFormGroup.get('billingInfo.address'); }
  get city() { return this.checkoutFormGroup.get('billingInfo.city'); }
  get country() { return this.checkoutFormGroup.get('billingInfo.country'); }
  get zipCode() { return this.checkoutFormGroup.get('billingInfo.zipCode'); }
  get cardNumber() { return this.checkoutFormGroup.get('paymentMethod.cardNumber'); }
  get cardHolder() { return this.checkoutFormGroup.get('paymentMethod.cardHolder'); }
  get expirationDate() { return this.checkoutFormGroup.get('paymentMethod.expirationDate'); }
  get cardType() { return this.checkoutFormGroup.get('paymentMethod.cardType'); }
  get notes() { return this.checkoutFormGroup.get('additionalInfo.notes'); }

}
