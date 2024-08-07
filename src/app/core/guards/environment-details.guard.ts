import {CanActivateFn} from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

/**
 * A guard that blocks other pages before filling environment details page.
 */
export const environmentDetailsGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    // when creating new model deployment, continue to model deployment details page only if environment is created
    if (route.parent?.params["id"] === 'new') {
        router.navigate(['deployment-management/new/environment-details']);
        return false;
    }

    return true;
};