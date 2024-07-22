import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {ModelDeployment} from "../../shared/models/modelDeployment.model";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {ModelDeploymentService} from "../services/model-deployment.service";

/**
 * A resolver that provides page data from the server during the navigation
 */
export const DeploymentManagementResolver: ResolveFn<ModelDeployment> = (route: ActivatedRouteSnapshot): Observable<ModelDeployment> => {

    const deploymentManagementService = inject(ModelDeploymentService);


    // if an id is given, then an existing page will be resolved
    if (route.paramMap.get('id') !== 'new') {
        const id = Number(route.paramMap.get('id'));
        return deploymentManagementService.getModelDeploymentById(id);
    }
    // otherwise, we can assume that a new page can be created
    else {
        return of(new ModelDeployment({deploymentId: 0}));
    }
}