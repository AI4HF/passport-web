import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Study} from "../../shared/models/study.model";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {StudyManagementService} from "../services/study-management.service";

/**
 * A resolver that provides page data from the server during the navigation
 */
export const StudyManagementResolver: ResolveFn<Study> = (route: ActivatedRouteSnapshot): Observable<Study> => {

        const studyManagementService = inject(StudyManagementService);
        const id = Number(route.paramMap.get('id'));

        // if an id is given, then an existing page will be resolved
        if (id) {
            return studyManagementService.getStudyById(id);
        }
        // otherwise, we can assume that a new page can be created
        else {
            return of(new Study({}));
        }
    }