import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {

  productCategories: ProductCategory[];

  selectedCategory: any;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.productService.getAllProductCategories().subscribe(
      data => {
        this.productCategories = data;
      }
    );
  }

  select(item) {
    this.selectedCategory = item; 
  };

  isActive(item) {
    this.route.queryParamMap.subscribe(
      () => {
        const querryParamCategoryId: number = +this.route.snapshot.queryParamMap.get('categoryId');
        this.selectedCategory = querryParamCategoryId - 1;
      }
    );
    return this.selectedCategory == item;
  };

}
