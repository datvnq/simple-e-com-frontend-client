import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  currentCategoryId: number;
  searchMode: boolean;

  page = 1;
  pageSize = 12;


  constructor(private productService: ProductService, 
    private cartService: CartService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProducts();
    }
    else {
      this.handleListProducts();
    }
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
      this.productService.getProductsByCategoryId(this.currentCategoryId).subscribe(
        data => {
          this.products = data;
        }
      );
      this.page = 1;
    }
    else {
      this.productService.getAllProducts().subscribe(
        data => {
          this.products = data;
        }
      );
    }
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');
    this.productService.getProductsByKeyword(keyword).subscribe(
      data => {
        this.products = data;
      }
    );
    this.page = 1;
  }

  addToCart(product: Product) {
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

}
