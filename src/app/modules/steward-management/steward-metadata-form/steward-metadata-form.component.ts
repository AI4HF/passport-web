import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../shared/components/base.component";
import { Dataset } from "../../../shared/models/dataset.model";
import { CatalogueDataset } from "../../../shared/models/catalogueDataset.model";
import { DatasetConcept } from "../../../shared/models/datasetConcept.model";
import { StorageUtil } from "../../../core/services/storageUtil.service";

/**
 * The metadata a Data Steward completes by hand for one of their organization's datasets: the
 * controlled-vocabulary values, and the publication decision with the properties that exist only
 * for publication. Everything else on the dataset is derived or computed, so it is not editable
 * here.
 */
@Component({
    selector: 'app-steward-metadata-form',
    templateUrl: './steward-metadata-form.component.html',
    styleUrls: ['./steward-metadata-form.component.scss']
})
export class StewardMetadataFormComponent extends BaseComponent implements OnInit {
    /** The dataset whose metadata is being completed */
    @Input() dataset: Dataset;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The publication record, when the dataset already has one */
    catalogueDataset: CatalogueDataset = null;
    /** The controlled-vocabulary values recorded so far */
    concepts: DatasetConcept[] = [];
    /** Form group for the publication metadata */
    catalogueForm: FormGroup;
    /** Form group for adding one concept */
    conceptForm: FormGroup;
    /** flag indicating that dialog is visible */
    display = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.loadMetadata();
    }

    /**
     * Loads whatever metadata the dataset already carries.
     */
    loadMetadata() {
        const studyId = this.activeStudyService.getActiveStudy();

        this.catalogueDatasetService.getCatalogueDatasetList(this.dataset.datasetId, studyId)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: records => {
                this.catalogueDataset = records.length ? records[0] : null;
                this.initializeForm();
            },
            error: () => this.initializeForm()
        });

        this.datasetConceptService.getDatasetConceptList(this.dataset.datasetId, studyId)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: concepts => {
                this.concepts = concepts;
            }
        });
    }

    /**
     * Initializes both form groups.
     */
    initializeForm() {
        const existing = this.catalogueDataset || new CatalogueDataset({});
        this.catalogueForm = new FormGroup({
            publicTitle: new FormControl(existing.publicTitle, Validators.required),
            publicDescription: new FormControl(existing.publicDescription),
            accessRights: new FormControl(existing.accessRights),
            hdabName: new FormControl(existing.hdabName),
            publisherName: new FormControl(existing.publisherName),
            contactPoint: new FormControl(existing.contactPoint),
            legalBasis: new FormControl(existing.legalBasis),
            purpose: new FormControl(existing.purpose),
            personalData: new FormControl(existing.personalData ?? false),
            applicableLegislation: new FormControl(existing.applicableLegislation),
            retentionPeriodStart: new FormControl(existing.retentionPeriodStart),
            retentionPeriodEnd: new FormControl(existing.retentionPeriodEnd),
            landingPage: new FormControl(existing.landingPage)
        });
        this.conceptForm = new FormGroup({
            propertyUri: new FormControl('', Validators.required),
            conceptUri: new FormControl('', Validators.required),
            prefLabel: new FormControl('', Validators.required),
            conceptScheme: new FormControl('')
        });
        this.display = true;
    }

    /**
     * Saves the publication decision, creating it the first time and updating it afterwards.
     */
    savePublication() {
        const studyId = this.activeStudyService.getActiveStudy();
        const payload: CatalogueDataset = new CatalogueDataset({
            ...(this.catalogueDataset || {}),
            ...this.catalogueForm.value,
            datasetId: this.dataset.datasetId,
            lastUpdatedBy: StorageUtil.retrieveUserId()
        });

        const request = this.catalogueDataset
            ? this.catalogueDatasetService.updateCatalogueDataset(payload, studyId)
            : this.catalogueDatasetService.createCatalogueDataset(
                new CatalogueDataset({ ...payload, createdBy: StorageUtil.retrieveUserId() }), studyId);

        request.pipe(takeUntil(this.destroy$)).subscribe({
            next: saved => {
                this.catalogueDataset = saved;
                this.translateService.get(['Success', 'StewardManagement.Publication metadata saved']).subscribe(t => {
                    this.messageService.add({
                        severity: 'success',
                        summary: t['Success'],
                        detail: t['StewardManagement.Publication metadata saved']
                    });
                });
            },
            error: (error) => {
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.status === 403
                            ? 'This dataset belongs to another organization.'
                            : error.message
                    });
                });
            }
        });
    }

    /**
     * Adds one controlled-vocabulary value to the dataset.
     */
    addConcept() {
        const studyId = this.activeStudyService.getActiveStudy();
        const concept: DatasetConcept = new DatasetConcept({
            ...this.conceptForm.value,
            datasetId: this.dataset.datasetId
        });

        this.datasetConceptService.createDatasetConcept(concept, studyId)
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: saved => {
                this.concepts = [...this.concepts, saved];
                this.conceptForm.reset();
            },
            error: (error) => {
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            }
        });
    }

    /**
     * Removes a controlled-vocabulary value.
     * @param concept The value to remove
     */
    removeConcept(concept: DatasetConcept) {
        this.datasetConceptService.deleteDatasetConcept(concept.conceptId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.concepts = this.concepts.filter(c => c.conceptId !== concept.conceptId);
            }
        });
    }

    /**
     * Closes the dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
