import {Component, Injector, OnInit} from '@angular/core';
import { ModelFigure } from '../../../shared/models/modelFigure.model';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";

@Component({
    selector: 'app-model-figure-gallery',
    templateUrl: './model-figure-gallery.component.html',
    styleUrls: ['./model-figure-gallery.component.scss']
})
export class ModelFigureGalleryComponent extends BaseComponent implements OnInit {

    /** The ID of the selected model */
    selectedModelId: string;
    /** The selected model figure object */
    selectedFigure?: ModelFigure;
    /** List of model figures */
    modelFigures: ModelFigure[] = [];
    /** Determines if the selected model figure is displayed */
    dialogVisible: boolean = false;
    /** Determines if the file upload form is displayed */
    addDialogVisible: boolean = false;
    /** The file selected for creating new model figure */
    newFigureFile?: File | null;
    /** The URL for prevıew new model figure */
    newFigurePreviewUrl?: string | null;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
    }


    ngOnInit(): void {
        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            const modelId = params.get('modelId');
            this.selectedModelId = modelId;
            this.loadFigures(modelId);
        });

    }

    /**
     * Loads figures of the model
     * @param modelId The ID of the model
     */
    loadFigures(modelId: string): void {
        this.modelFigureService.getModelFiguresByModelId(modelId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
                next: (modelFigures: ModelFigure[]) => {
                    this.modelFigures = modelFigures;
                },
                error: error => {
                    if(error.status != 404) {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    }
                }
        })
    }

    /**
     * Open figure inspect dialog
     * @param fig The model figure going to be inspected
     */
    openFigure(fig: ModelFigure) {
        this.selectedFigure = fig;
        this.dialogVisible = true;
    }

    /**
     * Delete the selected figure
     * @param fig The model figure going to be deleted
     * @param event
     */
    deleteFigure(fig: ModelFigure, event: Event) {
        event.stopPropagation();
        this.modelFigureService.deleteModelFigure(fig.figureId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$)).subscribe({
            next: (_: any) => {
                this.modelFigures = this.modelFigures.filter(f => f.figureId !== fig.figureId);
                this.translateService.get(['Success', 'ModelManagement.Model Figure is deleted successfully']).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations['ModelManagement.Model Figure is deleted successfully']
                    });
                });
            },
            error: error => {
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            }
        })
    }

    /**
     * Open figure uploading dialog
     */
    openAddFigureDialog() {
        this.addDialogVisible = true;
        this.newFigureFile = null;
        this.newFigurePreviewUrl = null;
    }

    /**
     * File selection for uploading the model figure
     * @param event
     */
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files && input.files[0];

        if (!file) {
            this.newFigureFile = null;
            this.newFigurePreviewUrl = null;
            return;
        }

        if (file.type !== 'image/png') {
            this.newFigureFile = null;
            this.newFigurePreviewUrl = null;
            return;
        }

        this.newFigureFile = file;
        this.newFigurePreviewUrl = URL.createObjectURL(file);
    }

    /**
     * Convert new figure into base64 and upload to the server
     */
    saveNewFigure() {
        if (!this.newFigureFile) {
            return;
        }

        const file = this.newFigureFile;

        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            const base64Data = result.split(',')[1];

            const modelFigure = new ModelFigure({
                modelId: this.selectedModelId,
                figureId: undefined,
                imageBase64: base64Data
            });

            this.modelFigureService.createModelFigure(modelFigure, this.activeStudyService.getActiveStudy())
                .pipe(takeUntil(this.destroy$)).subscribe({
                    next: (modelFigure: ModelFigure) => {
                        this.modelFigures.push(modelFigure);
                        this.translateService.get(['Success', 'ModelManagement.Model Figure is created successfully']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['ModelManagement.Model Figure is created successfully']
                            });
                        });
                    },
                    error: error => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    }
            })

            this.addDialogVisible = false;
            this.newFigureFile = null;

            if (this.newFigurePreviewUrl) {
                URL.revokeObjectURL(this.newFigurePreviewUrl);
            }
            this.newFigurePreviewUrl = null;
        };

        reader.readAsDataURL(file);
    }

    /**
     * Close the model uploading dialog
     */
    cancelAddFigure() {
        this.addDialogVisible = false;
        this.newFigureFile = null;
        if (this.newFigurePreviewUrl) {
            URL.revokeObjectURL(this.newFigurePreviewUrl);
        }
        this.newFigurePreviewUrl = null;
    }

    /**
     * Navigates back to the model table.
     */
    returnToModels() {
        this.router.navigate([`/model-management`]);
    }
}
