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

  getAllProducts(page: number, size: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products?` + `page=${page}&size=${size}`);
  }

  getProductsByKeyword(keyword: string, page: number, size: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products?` + `keyword=${keyword}` + `&page=${page}&size=${size}`);
  }

  getProductsByCategoryId(categoryId: number, page: number, size: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products?` + `categoryId=${categoryId}` + `&page=${page}&size=${size}`);
  }

  getProductsByKeywordAndCategoryId(categoryId: number, keyword: string, page: number, size: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/products?` + `categoryId=${categoryId}` + `&keyword=${keyword}` + `&page=${page}&size=${size}`);
  }

  getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseURL}/api/product/${productId}`);
  }

  getRelatedProducts(categoryId: number, productId: number, page: number, size: number): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseURL}/api/relatedProducts/${categoryId}/${productId}?` + `&page=${page}&size=${size}`);
  }

  getAllProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategory[]>(`${this.baseURL}/api/productCategories`);
  }

}
