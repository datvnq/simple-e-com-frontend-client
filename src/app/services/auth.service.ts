import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../common/user';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public username: string;
  public password: string;

  private baseURL = "http://localhost:8080";

  constructor(private httpClient: HttpClient, private notification: NzNotificationService) { }

  getAllUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.baseURL}/api/users`);
  }

  signUp(user: User): Observable<Object> {
    return this.httpClient.post(`${this.baseURL}/api/signup`, user).pipe(
      tap(() => {
        this.notification.success('You have signed up successfully!', 'Please login to continue');
      })
    )
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

