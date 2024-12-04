import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { FeatureSet } from "../../shared/models/featureset.model";
import { Observable, of } from "rxjs";
import { inject } from "@angular/core";
import { FeatureSetService } from "../services/featureset.service";
import {ActiveStudyService} from "../services/activeStudy.service";

/**
 * A resolver that provides page data from the server during the navigation
 */
export const FeatureSetResolver: ResolveFn<FeatureSet> = (route: ActivatedRouteSnapshot): Observable<FeatureSet> => {
    const featureSetService = inject(FeatureSetService);
    const activeStudyService = inject(ActiveStudyService);

    // if an id is given, then an existing page will be resolved
    if (route.paramMap.get('id') !== 'new') {
        const id = Number(route.paramMap.get('id'));
        return featureSetService.getFeatureSetById(id, +activeStudyService.getActiveStudy());
    }
    // otherwise, we can assume that a new page can be created
    else {
        return of(new FeatureSet({ featuresetId: 0 }));
    }
}
