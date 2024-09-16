import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PopulationService } from '../services/population.service';
import { map } from 'rxjs/operators';

/**
 * A guard that checks if there are any populations for the current study before allowing access
 * to the personnel assignment page. If no populations exist, it redirects to the population details page.
 */
@Injectable({
    providedIn: 'root'
})
export class PopulationGuard implements CanActivate {

    constructor(private populationService: PopulationService, private router: Router) {}

    /**
     * Method to check if the user can activate the personnel assignment route.
     * It fetches populations by study ID, and if none are found, it redirects to the population details page.
     *
     * @param route {ActivatedRouteSnapshot} The current route snapshot, including the parent route parameters.
     * @param state {RouterStateSnapshot} The router state snapshot, used to get the current route state.
     * @returns {Observable<boolean> | boolean} Returns true if populations exist for the study, or false with a redirection if not.
     */
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | boolean {
        const studyId = route.parent?.params['id'];

        if (!studyId || isNaN(studyId)) {
            this.router.navigate(['study-management', studyId, 'population-details']);
            return false;
        }

        return this.populationService.getPopulationByStudyId(+studyId).pipe(
            map(populations => {
                if (populations.length > 0) {
                    return true;
                } else {
                    this.router.navigate(['study-management', studyId, 'population-details']); // Redirect if no populations exist
                    return false;
                }
            })
        );
    }
}
