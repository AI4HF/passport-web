import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Study} from "../../shared/models/study.model";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {StudyService} from "../services/study.service";

/**
 * A resolver that provides page data from the server during the navigation
 */
export const StudyManagementResolver: ResolveFn<Study> = (route: ActivatedRouteSnapshot): Observable<Study> => {

        const studyManagementService = inject(StudyService);


        // if an id is given, then an existing page will be resolved
        if (route.paramMap.get('id') !== 'new') {
            const id = Number(route.paramMap.get('id'));
            return studyManagementService.getStudyById(id);
        }
        // otherwise, we can assume that a new page can be created
        else {
            return of(new Study({id: 0}));
        }
    }