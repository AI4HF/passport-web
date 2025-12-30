import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";

/**
 * A guard that blocks direct access to model deployment if environment data isn't ready.
 */
export const environmentDetailsGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const id = route.parent?.params["id"];

    if (id !== 'new') {
        return true;
    }

    const navigation = router.getCurrentNavigation();
    const hasPendingData = navigation?.extras.state?.['pendingEnvironmentData'];

    if (hasPendingData) {
        return true;
    }

    router.navigate(['deployment-management/new/environment-details']);
    return false;
};