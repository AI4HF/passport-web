import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class OrganizationPersonnelGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(): boolean {
        const currentOrganizationId = localStorage.getItem('currentOrganizationId');
        if (currentOrganizationId) {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
