import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LinkedArticle } from '../../../../../shared/models/linkedArticle.model';
import { takeUntil } from 'rxjs';

/**
 * Component for managing linked article forms within a study.
 */
@Component({
    selector: 'app-linked-articles-form',
    templateUrl: './linked-articles-form.component.html',
    styleUrls: ['./linked-articles-form.component.scss']
})
export class LinkedArticlesFormComponent extends BaseComponent implements OnInit {

    /** The ID of the linked article to be edited or created */
    @Input() linkedArticleId: string;

    /** The ID of the working study */
    @Input() currentStudyId: string;

    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The form group for the linked article */
    articleForm: FormGroup;

    /** Whether the form dialog is displayed */
    display: boolean = false;

    /** The linked article being edited or created */
    selectedLinkedArticle: LinkedArticle;

    /** Flag indicating if the form is in update mode */
    isUpdateMode: boolean = false;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.initializeForm();
        if (this.linkedArticleId) {
            this.isUpdateMode = true;
            this.loadLinkedArticle(this.linkedArticleId);
        } else {
            this.selectedLinkedArticle = new LinkedArticle({});
            this.display = true;
        }
    }

    /**
     * Initializes the form group with the linked article data.
     */
    initializeForm() {
        this.articleForm = new FormGroup({
            articleUrl: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required)
        });
    }

    /**
     * Loads the linked article data by ID and updates the form.
     * @param id The ID of the linked article to be loaded
     */
    loadLinkedArticle(id: string) {
        this.linkedArticleService.getLinkedArticleById(id, this.currentStudyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: article => {
                    this.selectedLinkedArticle = article;
                    this.updateForm();
                    this.display = true;
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
            });
    }

    /**
     * Updates the form with the loaded linked article details.
     */
    updateForm() {
        this.articleForm.patchValue({
            articleUrl: this.selectedLinkedArticle.articleUrl,
            description: this.selectedLinkedArticle.description
        });
    }

    /**
     * Saves the linked article, either creating a new one or updating an existing one.
     */
    saveLinkedArticle() {
        const formValues = this.articleForm.value;

        if (!this.selectedLinkedArticle.linkedArticleId) {
            const newArticle: LinkedArticle = new LinkedArticle({
                ...formValues,
                studyId: this.currentStudyId
            });

            this.linkedArticleService.createLinkedArticle(newArticle, this.currentStudyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: article => {
                        this.selectedLinkedArticle = article;
                        this.initializeForm();
                        this.translateService.get(['Success', 'StudyManagement.LinkedArticle.LinkedArticleCreated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['StudyManagement.LinkedArticle.LinkedArticleCreated']
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });

        } else {
            const updatedArticle: LinkedArticle = new LinkedArticle({
                linkedArticleId: this.selectedLinkedArticle.linkedArticleId,
                studyId: this.currentStudyId,
                ...formValues
            });

            this.linkedArticleService.updateLinkedArticle(updatedArticle, this.currentStudyId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (article: LinkedArticle) => {
                        this.selectedLinkedArticle = article;
                        this.initializeForm();
                        this.translateService.get(['Success', 'StudyManagement.LinkedArticle.LinkedArticleUpdated']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'success',
                                summary: translations['Success'],
                                detail: translations['StudyManagement.LinkedArticle.LinkedArticleUpdated']
                            });
                        });
                    },
                    error: (error: any) => {
                        this.translateService.get('Error').subscribe(translation => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translation,
                                detail: error.message
                            });
                        });
                    },
                    complete: () => {
                        this.closeDialog();
                    }
                });
        }
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
