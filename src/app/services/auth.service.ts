import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public username: string;
  public password: string;

  private baseURL = "http://localhost:8080";

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/api/users`);
  }

  signUp(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/api/signup`, user);
  }

  login(username: string, password: string) {
    return this.httpClient.get(`${this.baseURL}/api/login`, 
                                { headers: { authorization: this.createBasicAuthToken(username, password) } })
    .pipe(map((res) => {
        this.username = username;
        this.password = password;
      }));
  }

  createBasicAuthToken(username: string, password: string) {
    return 'Basic ' + window.btoa(username + ":" + password);
  }

}

