import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {LinkedArticle} from "../../../../shared/models/linkedArticle.model";

/**
 * Shows list of linked articles related to the study
 */
@Component({
    selector: 'app-linked-articles',
    templateUrl: './linked-articles.component.html',
    styleUrls: ['./linked-articles.component.scss']
})
export class LinkedArticlesComponent extends BaseComponent implements OnInit {

    /**
     * The form object keeping the linked article URL.
     */
    articleForm: FormGroup;

    /**
     * The LinkedArticle list for selected Study
     */
    articleList: LinkedArticle[] = [];

    /**
     * The studyId for selected study
     */
    studyId: string;

    /**
     * Indicates whether user can edit this page
     */
    viewMode: boolean = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.viewMode = params['viewMode'] === 'true';
        });

        this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
            this.studyId = params.get('id');
            this.fetchArticlesByStudyId(this.studyId);
        });

        this.initializeForm();
    }

    /**
     * Fetch articles from linked article service
     * @param studyId ID of the study related to linked articles
     */
    fetchArticlesByStudyId(studyId: string): void {
        this.linkedArticleService.getLinkedArticlesByStudyId(studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (articleList: LinkedArticle[]) => {
                    this.articleList = articleList.map(article => new LinkedArticle(article));
                },
                error: (error: any) => {
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
     * Back to previous step in study management
     */
    back() {
        this.router.navigate([`../experiment-questions`], {relativeTo: this.route, queryParams: this.route.snapshot.queryParams});
    }

    /**
     * Save created linked articles
     */
    save() {
        this.linkedArticleService.createLinkedArticles(this.studyId, this.articleList)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.fetchArticlesByStudyId(this.studyId);
                    this.translateService.get(['Success', 'StudyManagement.LinkedArticle.Linked articles are assigned successfully']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['StudyManagement.LinkedArticle.Linked articles are assigned successfully']
                        });
                    });
                }
            });
    }

    /**
     * Initializes the form object for the linked article URL.
     */
    initializeForm() {
        this.articleForm = new FormGroup({
            articleUrl: new FormControl('', Validators.required)
        });
        if (this.viewMode) {
            this.articleForm.get('articleUrl')?.disable({ emitEvent: false });
        }
    }

    /**
     * Add linked article into articleList.
     */
    addArticle() {
        const articleUrl = this.articleForm.value.articleUrl;
        if (articleUrl.length > 0) {
            this.initializeForm();
            if (!this.articleList.find(article => article.articleUrl === articleUrl)) {
                this.articleList.push(new LinkedArticle({linkedArticleId: null, studyId: null, articleUrl}));
            }
        }
    }

    /**
     * Delete linked article from articleList.
     */
    deleteArticle(url: string) {
        this.articleList = this.articleList.filter(article => article.articleUrl !== url);
    }
}
