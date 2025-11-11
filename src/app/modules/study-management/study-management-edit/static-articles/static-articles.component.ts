import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {takeUntil} from "rxjs";
import {StaticArticle} from "../../../../shared/models/staticArticle.model";

/**
 * Shows list of static articles related to the study
 */
@Component({
    selector: 'app-static-articles',
    templateUrl: './static-articles.component.html',
    styleUrls: ['./static-articles.component.scss']
})
export class StaticArticlesComponent extends BaseComponent implements OnInit {

    /**
     * The form object keeping the static article URL.
     */
    articleForm: FormGroup;

    /**
     * The StaticArticle list for selected Study
     */
    articleList: StaticArticle[] = [];

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
     * Fetch articles from static article service
     * @param studyId ID of the study related to static articles
     */
    fetchArticlesByStudyId(studyId: string): void {
        this.staticArticleService.getStaticArticlesByStudyId(studyId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (articleList: StaticArticle[]) => {
                    this.articleList = articleList.map(article => new StaticArticle(article));
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
     * Save created static articles
     */
    save() {
        this.staticArticleService.createStaticArticles(this.studyId, this.articleList)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: response => {
                    this.fetchArticlesByStudyId(this.studyId);
                    this.translateService.get(['Success', 'StudyManagement.StaticArticle.Static articles are assigned successfully']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['StudyManagement.StaticArticle.Static articles are assigned successfully']
                        });
                    });
                }
            });
    }

    /**
     * Initializes the form object for the static article URL.
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
     * Add static article into articleList.
     */
    addArticle() {
        const articleUrl = this.articleForm.value.articleUrl;
        if (articleUrl.length > 0) {
            this.initializeForm();
            if (!this.articleList.find(article => article.articleUrl === articleUrl)) {
                this.articleList.push(new StaticArticle({staticArticleId: null, studyId: null, articleUrl}));
            }
        }
    }

    /**
     * Delete static article from articleList.
     */
    deleteArticle(url: string) {
        this.articleList = this.articleList.filter(article => article.articleUrl !== url);
    }
}
