import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { LinkedArticle } from '../../../../../shared/models/linkedArticle.model';
import { takeUntil } from 'rxjs';

/**
 * Component to display and manage linked articles within a study.
 */
@Component({
    selector: 'app-linked-articles-table',
    templateUrl: './linked-articles-table.component.html',
    styleUrls: ['./linked-articles-table.component.scss']
})
export class LinkedArticlesTableComponent extends BaseComponent implements OnInit {

    /** List of linked articles in the selected study */
    articles: LinkedArticle[] = [];

    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /** The linked article ID selected for editing */
    selectedLinkedArticleId: string = null;

    /** Loading state of the table */
    loading: boolean = true;

    /** Columns to be displayed in the table */
    columns: any[];

    /** Current study Id */
    studyId: string = null;

    /**
     * Indicates whether user can edit this page
     */
    viewMode: boolean = false;

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
        this.route.queryParams.subscribe(params => {
            this.viewMode = params['viewMode'] === 'true';
        });

        this.columns = [
            { field: 'linkedArticleId', header: 'StudyManagement.LinkedArticle.LinkedArticleID' },
            { field: 'articleUrl',      header: 'StudyManagement.LinkedArticle.URL' },
            { field: 'description',     header: 'StudyManagement.LinkedArticle.Description' }
        ];

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.studyId = params.get('id');
            this.loadArticles();
        });
    }

    /**
     * Loads the linked articles of the current study.
     */
    loadArticles() {
        this.linkedArticleService.getLinkedArticlesByStudyId(this.studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (articles) => {
                    this.articles = articles;
                    this.loading = false;
                },
                error: error => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                    this.loading = false;
                }
            });
    }

    /**
     * Deletes a linked article by its ID.
     * @param linkedArticleId The ID of the linked article to be deleted
     */
    deleteLinkedArticle(linkedArticleId: string) {
        this.linkedArticleService.deleteLinkedArticle(linkedArticleId, this.studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.articles = this.articles.filter(a => a.linkedArticleId !== linkedArticleId);
                    this.translateService.get(['Success', 'StudyManagement.LinkedArticle.LinkedArticleDeleted']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['StudyManagement.LinkedArticle.LinkedArticleDeleted']
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
            });
    }

    /**
     * Displays the form for editing a linked article.
     * @param linkedArticleId The ID of the linked article to be edited
     */
    showLinkedArticleForm(linkedArticleId: string) {
        this.selectedLinkedArticleId = linkedArticleId;
        this.displayForm = true;
    }

    /**
     * Displays the form for creating a new linked article.
     */
    createLinkedArticle() {
        this.selectedLinkedArticleId = null;
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
}
