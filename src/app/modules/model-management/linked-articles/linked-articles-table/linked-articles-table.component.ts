import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../shared/components/base.component';
import { LinkedArticle } from '../../../../shared/models/linkedArticle.model';
import { takeUntil } from 'rxjs';

/**
 * Component to display and manage the publications linked to a model.
 */
@Component({
    selector: 'app-linked-articles-table',
    templateUrl: './linked-articles-table.component.html',
    styleUrls: ['./linked-articles-table.component.scss']
})
export class LinkedArticlesTableComponent extends BaseComponent implements OnInit {

    /** List of articles linked to the selected model */
    articles: LinkedArticle[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The article ID selected for editing */
    selectedArticleId: string = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

    /** The ID of the model whose articles are shown */
    modelId: string = null;

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
        this.columns = [
            { field: 'title',            header: 'LinkedArticle.Title' },
            { field: 'authors',          header: 'LinkedArticle.Authors' },
            { field: 'publicationVenue', header: 'LinkedArticle.PublicationVenue' },
            { field: 'publicationYear',  header: 'LinkedArticle.PublicationYear' },
            { field: 'doi',              header: 'LinkedArticle.Doi' }
        ];

        this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.modelId = params.get('modelId');
            this.loadArticles();
        });
    }

    /**
     * Loads the articles linked to the current model.
     */
    loadArticles() {
        this.loading = true;
        this.linkedArticleService.getLinkedArticlesByModelId(this.modelId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (articles) => {
                    this.articles = articles;
                    this.loading = false;
                },
                error: error => {
                    this.showError(error);
                    this.loading = false;
                }
            });
    }

    /**
     * Deletes a linked article by its ID.
     * @param articleId The ID of the linked article to be deleted
     */
    deleteLinkedArticle(articleId: string) {
        this.linkedArticleService.deleteLinkedArticle(articleId, this.activeStudyService.getActiveStudy())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.articles = this.articles.filter(a => a.articleId !== articleId);
                    this.translateService.get(['Success', 'LinkedArticle.LinkedArticleDeleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['LinkedArticle.LinkedArticleDeleted']
                        });
                    });
                },
                error: error => this.showError(error)
            });
    }

    /**
     * Displays the form for editing a linked article.
     * @param articleId The ID of the linked article to be edited
     */
    showLinkedArticleForm(articleId: string) {
        this.selectedArticleId = articleId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new linked article.
     */
    createLinkedArticle() {
        this.selectedArticleId = null;
        this.displayForm = true;
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadArticles();
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Navigates back to the model table.
     */
    returnToModels() {
        this.router.navigate([`/model-management`]);
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
