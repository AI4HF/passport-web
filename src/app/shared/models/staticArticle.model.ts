/**
 * Model for passport StaticArticle class
 */
export class StaticArticle{
    /**
     * The ID of the Static Article
     */
    staticArticleId: string;

    /**
     * The ID reference to the Study
     */
    studyId: string;

    /**
     * The article URL associated with the study
     */
    articleUrl: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.staticArticleId = data.staticArticleId;
        this.studyId = data.studyId;
        this.articleUrl = data.articleUrl;
    }
}
