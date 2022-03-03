import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { Purchase } from '../common/purchase';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseURL = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.baseURL}/api/countries`);
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient.get<State[]>(`${this.baseURL}/api/states/${countryCode}`);
  }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(`${this.baseURL}/api/purchase`, purchase);
  }
}
