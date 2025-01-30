import {BehaviorSubject, Observable} from "rxjs";
import {Role} from "../../shared/models/role.enum";
import {Injectable} from "@angular/core";
import {ROLES} from "../../shared/models/roles.constant";

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
        this.roles.next([]);
    }

    /**
     * Set roles of the user
     * @param roles List of roles for the user
     */
    setRoles(roles: Role[]) {
        if(roles != null){
            let roleString = JSON.stringify(roles);
            sessionStorage.setItem("roles", roleString);
            this.roles.next(JSON.parse(roleString));
        }
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
        let roles = this.roles.getValue();
        if(roles == null)
        {
            return [];
        }
        return roles;
    }

    /**
     * Clear roles of the user
     */
    clearRoles() {
        sessionStorage.removeItem('roles');
        this.roles.next([]);
    }
}
