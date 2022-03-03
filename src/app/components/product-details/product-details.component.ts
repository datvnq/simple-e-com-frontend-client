import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  page = 1;
  pageSize = 4;

  product: Product = new Product();
  categoryId: number;
  allProducts: Product[] = [];
  relatedProducts: Product[] = [];

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(productId).subscribe(
      data1 => {
        this.product = data1;
        this.categoryId = data1.categoryId;
        this.productService.getProductsByCategoryId(this.categoryId).subscribe(
          data2 => {
            this.allProducts = data2;
            for (let tempProduct of this.allProducts) {
              if (tempProduct.id !== this.product.id) {
                this.relatedProducts.push(tempProduct);
              }
            }
          }
        );
      }
    );
  }

  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

}
