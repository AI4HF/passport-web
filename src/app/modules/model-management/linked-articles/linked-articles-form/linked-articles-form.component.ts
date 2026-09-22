import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LinkedArticle } from '../../../../shared/models/linkedArticle.model';
import { takeUntil } from 'rxjs';

/**
 * Component for the form that links a publication to a model.
 */
@Component({
    selector: 'app-linked-articles-form',
    templateUrl: './linked-articles-form.component.html',
    styleUrls: ['./linked-articles-form.component.scss']
})
export class LinkedArticlesFormComponent extends BaseComponent implements OnInit {

    /** The ID of the linked article to be edited or created */
    @Input() articleId: string;

    /** The ID of the model the article is linked to */
    @Input() modelId: string;

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
        if (this.articleId) {
            this.isUpdateMode = true;
            this.loadLinkedArticle(this.articleId);
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
            title: new FormControl('', Validators.required),
            authors: new FormControl(''),
            publicationVenue: new FormControl(''),
            publicationYear: new FormControl(null),
            doi: new FormControl(''),
            url: new FormControl(''),
            description: new FormControl('')
        });
    }

    /**
     * Loads the linked article data by ID and updates the form.
     * @param id The ID of the linked article to be loaded
     */
    loadLinkedArticle(id: string) {
        this.linkedArticleService.getLinkedArticleById(id, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: article => {
                    this.selectedLinkedArticle = article;
                    this.updateForm();
                    this.display = true;
                },
                error: error => this.showError(error)
            });
    }

    /**
     * Updates the form with the loaded linked article details.
     */
    updateForm() {
        this.articleForm.patchValue({
            title: this.selectedLinkedArticle.title,
            authors: this.selectedLinkedArticle.authors,
            publicationVenue: this.selectedLinkedArticle.publicationVenue,
            publicationYear: this.selectedLinkedArticle.publicationYear,
            doi: this.selectedLinkedArticle.doi,
            url: this.selectedLinkedArticle.url,
            description: this.selectedLinkedArticle.description
        });
    }

    /**
     * Saves the linked article, either creating a new one or updating an existing one.
     */
    saveLinkedArticle() {
        const studyId = this.activeStudyService.getActiveStudy();
        const article: LinkedArticle = new LinkedArticle({
            articleId: this.selectedLinkedArticle.articleId,
            modelId: this.modelId,
            ...this.articleForm.value
        });

        const isUpdate = !!this.selectedLinkedArticle.articleId;
        const request = isUpdate
            ? this.linkedArticleService.updateLinkedArticle(article, studyId)
            : this.linkedArticleService.createLinkedArticle(article, studyId);
        const messageKey = isUpdate ? 'LinkedArticle.LinkedArticleUpdated' : 'LinkedArticle.LinkedArticleCreated';

        request.pipe(takeUntil(this.destroy$)).subscribe({
            next: (saved: LinkedArticle) => {
                this.selectedLinkedArticle = saved;
                this.initializeForm();
                this.translateService.get(['Success', messageKey]).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations[messageKey]
                    });
                });
            },
            error: (error: any) => this.showError(error),
            complete: () => {
                this.closeDialog();
            }
        });
    }

    /**
     * Closes the form dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }

    /**
     * Shows an error toast.
     * @param error The error to be shown
     */
    private showError(error: any) {
        this.translateService.get('Error').subscribe(translation => {
            this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
            });
        });
    }
}
