import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { OrganizationStateService } from "../services/organization-state.service";

/**
 * A guard that prevents access to the personnel page if no organization is selected.
 */
export const organizationPersonnelGuard: CanActivateFn = () => {
    const router = inject(Router);
    const organizationStateService = inject(OrganizationStateService);

    const organizationId = organizationStateService.getOrganizationId();
    if (!organizationId) {
        router.navigate(['/organization-management/organization']);
        return false;
    }
    return true;
};
