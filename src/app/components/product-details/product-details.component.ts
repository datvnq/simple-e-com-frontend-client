import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  size = 4;

  product: Product = new Product();
  categoryId: number;
  relatedProducts: Product[];
  totalPages: number[];

  selectedPage: any;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.route.queryParamMap.subscribe(() => {
        this.handleProductDetails();
      });
    });
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id');
    this.productService.getProductById(productId).subscribe(
      data1 => {
        this.product = data1;
        this.categoryId = data1.categoryId;

        this.page = +this.route.snapshot.queryParamMap.get('page');
        if (this.page < 1) {
          this.page = 1;
        }

        this.productService.getRelatedProducts(this.categoryId, +this.product.id, this.page - 1, this.size).subscribe(
          data2 => {
            this.relatedProducts = data2['productDtoList'];
            this.totalPages = new Array(data2['totalPages']);
          }
        );
      }
    );
  }

  addToCart() {
    const cartItem = new CartItem(this.product);
    this.cartService.addToCart(cartItem);
  }

  select(item) {
    this.selectedPage = item; 
  };

  isActive(item) {
    this.route.queryParamMap.subscribe(
      () => {
        const querryParamPage: number = +this.route.snapshot.queryParamMap.get('page');
        this.selectedPage = querryParamPage - 1;
      }
    );
    return this.selectedPage == item;
  };

  selectPage() {
    this.route.queryParamMap.subscribe(
      () => {
        const querryParamPage: number = +this.route.snapshot.queryParamMap.get('page');
        this.selectedPage = querryParamPage - 1;
        this.select(this.selectedPage);
        this.isActive(this.selectedPage);
      }
    );
  }

}
