import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { FeatureSet } from "../../../shared/models/featureset.model";
import { takeUntil } from "rxjs";

/**
 * A controller to edit the details of a FeatureSet object
 */
@Component({
    selector: 'app-featureset-management-edit',
    templateUrl: './featureset-management-edit.component.html',
    styleUrls: ['./featureset-management-edit.component.scss']
})
export class FeatureSetManagementEditComponent extends BaseComponent implements OnInit {

    /** The currently selected feature set */
    selectedFeatureSet: FeatureSet;

    /** Flag indicating if the table should be visible */
    showTable: boolean = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
            next: data => {
                this.selectedFeatureSet = data['featureSet'];
                this.showTable = !!this.selectedFeatureSet?.featuresetId;
            },
            error: error => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }
}
