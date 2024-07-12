import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";

/**
 * A controller to edit the details of a FeatureSet object
 */
@Component({
    selector: 'app-featureset-management-edit',
    templateUrl: './featureset-management-edit.component.html',
    styleUrls: ['./featureset-management-edit.component.scss']
})
export class FeatureSetManagementEditComponent extends BaseComponent implements OnInit {

    /**
     * The steps of a feature set
     */
    featureSetSteps: any[];

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.featureSetSteps = [
            { name: this.translateService.instant('FeatureSetManagement.FeatureSetDetails'), routerLink: 'featureset-details' },
            { name: this.translateService.instant('FeatureSetManagement.FeatureSetFeatures'), routerLink: 'featureset-features' }
        ];
    }
}
