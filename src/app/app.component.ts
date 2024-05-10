import { Component } from '@angular/core';
import {ApiService} from "./service/api.service";
import {Router} from "@angular/router";
import {TranslateService} from '@ngx-translate/core';
import { TokenUtil } from "./utils/token.util";

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
  userRoles: string[] = [];
  isLoggedIn: boolean = false;
  token: string = null;

  /**
   * Constructor of the main app which handles the set up of the default language and the currently used language of the translator choice.
   */
  constructor(private apiService: ApiService, private router: Router, private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  /**
   * Login status checking logic which handles the required task to deduce whether a user is authorized to view certain items.
   */
  loginCheck(): boolean {
    this.token = localStorage.getItem('token');
    if(this.token === null) return false;
    if(this.userRoles.length != 0) return true;
    this.userRoles = TokenUtil.extractUserRoles(this.token);
    return true;


  }

  /**
   * Front-end side logout logic which handles the token deletion and redirection upon click.
   */
  logout(): void {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }
}
