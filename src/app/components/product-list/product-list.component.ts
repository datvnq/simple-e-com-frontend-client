import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[];

  constructor(private productService: ProductService, private cartService: CartService) { }

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts() {
    this.productService.getAllProducts().subscribe(
      data => {
        this.products = data;
      }
    );
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
