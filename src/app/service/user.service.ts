import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Class which holds role data instances after they're read from token resources.
 */
@Injectable({
  providedIn: 'root'
})
/**
 * New service class which helps calling users' roles to be stored.
 */
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
