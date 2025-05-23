import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Dataset } from "../../shared/models/dataset.model";
import { Observable, of } from "rxjs";
import { inject } from "@angular/core";
import { DatasetService } from "../services/dataset.service";
import {ActiveStudyService} from "../services/activeStudy.service";

/**
 * A resolver that provides page data from the server during the navigation
 */
export const DatasetResolver: ResolveFn<Dataset> = (route: ActivatedRouteSnapshot): Observable<Dataset> => {
    const datasetService = inject(DatasetService);
    const activeStudyService = inject(ActiveStudyService)

    // if an id is given, then an existing page will be resolved
    if (route.paramMap.get('id') !== 'new') {
        const id = route.paramMap.get('id');
        return datasetService.getDatasetById(id, activeStudyService.getActiveStudy());
    }
    // otherwise, we can assume that a new page can be created
    else {
        return of(new Dataset({ datasetId: 0 }));
    }
}
