import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

/**
 * Dataset guard which declines access to the next stages of dataset management in case of the current dataset being a new dataset.
 */
@Injectable({
    providedIn: 'root'
})
export class DatasetGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        const datasetId = route.parent.paramMap.get('id');

        if (datasetId === 'new' || Number(datasetId) === 0) {
            this.router.navigate(['dataset-management/new/dataset-details']);
            return false;
        }

        return true;
    }
}

