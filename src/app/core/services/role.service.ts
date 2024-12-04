import { BehaviorSubject, Observable } from "rxjs";
import { Role } from "../../shared/models/role.enum";
import { Injectable } from "@angular/core";

/**
 * Service to manage the roles of the logged user.
 */
@Injectable({
    providedIn: 'root'
})
export class RoleService {

    /**
     * List of roles for the user
     */
    roles: BehaviorSubject<Role[]> = new BehaviorSubject<Role[]>([]);

    constructor() {
        // Initially, no roles are set
        this.roles.next([]);
    }

    /**
     * Set roles of the user
     * @param roles List of roles for the user
     */
    setRoles(roles: Role[]) {
        var roleString = JSON.stringify(roles);
        sessionStorage.setItem("roles", roleString);
        this.roles.next(JSON.parse(roleString));
    }

    /**
     * Get roles of the user as observable
     * @return {Observable<Role[]>}
     */
    getRolesAsObservable(): Observable<Role[]> {
        this.setRoles(JSON.parse(sessionStorage.getItem("roles")));
        return this.roles.asObservable();
    }

    /**
     * Get current roles of the user
     * @return {Role[]}
     */
    getRoles(): Role[] {
        return this.roles.getValue();
    }

    /**
     * Clear roles of the user
     */
    clearRoles() {
        this.roles.next([]);
    }
}
