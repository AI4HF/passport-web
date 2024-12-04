import {ActivatedRoute, CanActivateFn, Route} from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { StorageUtil } from '../services/storageUtil.service';

/**
 * A guard that prevents access to routes if the user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    if (!StorageUtil.retrieveToken()) {
        router.navigate(['/login']);
        return false;
    }

    const path: string = router.getCurrentNavigation().finalUrl.toString();

    return true;
};

