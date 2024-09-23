import {BehaviorSubject, Observable} from "rxjs";
import {Role} from "../../shared/models/role.enum";
import {Injectable, Injector} from "@angular/core";
import {StorageUtil} from "./storageUtil.service";
import {JwtHelperService} from "@auth0/angular-jwt";


/**
 * Service to manage the role of the logged user.
 */
@Injectable({
    providedIn: 'root'
})
export class RoleService {

    /**
     * Role of the personnel
     */
    role: BehaviorSubject<Role> = new BehaviorSubject(null);

    constructor(private injector: Injector) {
        const token = StorageUtil.retrieveToken();
        if(token){
            const helper = new JwtHelperService();
            const decodedToken = helper.decodeToken(token);
            const role: Role = decodedToken.realm_access.roles?.find((role: string) => Role[role as keyof typeof Role] !== undefined);
            this.role.next(role);
        }
    }

    /**
     * Set role of the user
     * @param role Role of the user
     */
    setRole(role: Role) {
        this.role.next(role);
    }

    /**
     * Get role of the user as observable
     * @return {Observable<Role>}
     */
    getRoleAsObservable(): Observable<Role> {
        return this.role.asObservable();
    }

    /**
     * Get role of the user
     * @return {Role}
     */
    getRole(): Role {
        return this.role.getValue();
    }

    /**
     * Clear role of the user
     */
    clearRole(){
        this.role.next(null);
    }

}