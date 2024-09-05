import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Learning Process guard which declines access to the next stages of dataset management in case of the current dataset being a new dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class LpGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const processId = route.parent.paramMap.get('id');

        if (processId === 'new' || Number(processId) === 0) {
            this.router.navigate(['learning-process-management/new/learning-process-and-implementation-details']);
            return false;
        }

        return true;
    }
}
