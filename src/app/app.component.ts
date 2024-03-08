import { Component } from '@angular/core';
import {ApiService} from "./service/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
/**
 * General implementation of the main component. Will grow larger with the addition of the common headers and menus of different pages
 */
export class AppComponent {
  title = 'AI4HF Passport GUI';

  constructor(private apiService: ApiService, private router: Router) {}
}
