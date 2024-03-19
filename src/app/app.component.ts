import { Component } from '@angular/core';
import {ApiService} from "./service/api.service";
import {Router} from "@angular/router";

/**
 * General implementation of the main component. Will grow larger with the addition of the common headers and menus of different pages
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AI4HF Passport GUI';
  userRoles: string[];

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {

    sessionStorage.setItem("token", "invalid")

  }
  loginCheck():boolean
  {
    const token = sessionStorage.getItem("token");
    if(token === "invalid")
    {
      return false;
    }
    this.userRoles = JSON.parse(localStorage.getItem('roles'));
    return true;

  }
}
