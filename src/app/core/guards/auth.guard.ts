import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { StorageUtil } from '../services/storageUtil.service';

/**
 * A guard that prevents access to routes if the user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const storageUtilService = new StorageUtil();

    if (storageUtilService.retrieveToken()) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

