import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  username: string;

  constructor() { }

  ngOnInit(): void {
  }

  loginStatus() {
    this.username = localStorage.getItem('token');
    return this.username;
  }

  logout() {
    localStorage.removeItem('token');
  }

}
