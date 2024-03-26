import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Class which holds role data instances after they're read from the Token's resources in Login Component script.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  /**
   * Variable which is directly used to store and get the roles of the desired user.
   */
  private rolesSubject = new BehaviorSubject<string[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  constructor() { }
  /**
   * Method which copies the given roles to this class' rolesSubject variable.
   * @param roles Roles extracted from a user's token.
   */
  setRoles(roles: string[]) {
    this.rolesSubject.next(roles);
  }
}
