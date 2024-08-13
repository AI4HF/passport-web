import {ActivatedRoute, CanActivateFn, Route} from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { StorageUtil } from '../services/storageUtil.service';
import {RoleService} from "../services/role.service";
import {Role} from "../../shared/models/role.enum";

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

    const roleService: RoleService = inject(RoleService);
    const role: Role = roleService.getRole();

    switch (role){
        case Role.STUDY_OWNER:
            if(!path.includes('study-management')){
                router.navigate(['/login']);
                return false;
            }
            break;
        case Role.DATA_SCIENTIST:
            if(!path.includes('parameter-management')){
                router.navigate(['/login']);
                return false;
            }
            break;
        case Role.SURVEY_MANAGER:
            if(!path.includes('survey-management')){
                router.navigate(['/login']);
                return false;
            }
            break;
        case Role.DATA_ENGINEER:
            if(!path.includes('featureset-management') && !path.includes('dataset-management')){
                router.navigate(['/login']);
                return false;
            }
            break;
        case Role.ML_ENGINEER:
            //TODO:
            return false;
            break;
        case Role.QUALITY_ASSURANCE_SPECIALIST:
            //TODO:
            return false;
            break;
        case Role.ORGANIZATION_ADMIN:
            if(!path.includes('organization-management')){
                router.navigate(['/login']);
                return false;
            }
            break;
    }

    return true;
};

