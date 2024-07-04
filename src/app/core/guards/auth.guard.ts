import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";

/**
 * A guard that prevents access to routes if the user is not authenticated.
 */
export const authGuard: CanActivateFn = () => {
    const router = inject(Router);

    const localStorageToken = localStorage.getItem('token');
    const sessionStorageToken = sessionStorage.getItem('token');

    if (!localStorageToken && !sessionStorageToken) {
        router.navigate(['/login']);
        return false;
    }
    return true;
};

