import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

/**
 * A guard that prevents access to routes if the user is not authenticated.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);

    const token = localStorage.getItem('token');
    if (!token) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};
