import { Component } from '@angular/core';
import {ApiService} from "./service/api.service";
import {Router} from "@angular/router";
import {UserService} from "./service/user.service";

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

  constructor(private apiService: ApiService, private router: Router, private userService: UserService) {}

  loginCheck(): boolean {
    const token = localStorage.getItem("token");
    if (token === null) {
      return false;
    }

    let userRoles: string[] = [];
    this.userService.roles$.subscribe(roles => userRoles = roles);

    if (userRoles && userRoles.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
