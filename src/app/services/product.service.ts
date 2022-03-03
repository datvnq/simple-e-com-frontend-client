import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private baseURL = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseURL}/api/product/${productId}`);
  }

  getProductsByKeyword(keyword: string): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products/${keyword}`);
  }

  getProductsByCategoryId(categoryId: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/productCategory/${categoryId}`);
  }

  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${this.baseURL}/api/productCategories`);
  }

}
