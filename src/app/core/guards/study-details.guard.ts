import {CanActivateFn} from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

/**
 * A guard that blocks other pages before filling study details page.
 */
export const studyDetailsGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    if (route.parent?.params["id"] === 'new') {
        router.navigate(['study-management/new/study-details']);
        return false;
    }
    return true;
};
