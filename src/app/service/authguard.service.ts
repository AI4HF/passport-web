import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

/**
 * Class which is responsible for catching instances where the user tries to enter unauthorized pages, and redirects the user back to the login page instead.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  /**
   * Method called upon page changes automatically. Handles the job of the entire class.
   */
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
