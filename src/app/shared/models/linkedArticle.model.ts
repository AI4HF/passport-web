/**
 * Model for passport LinkedArticle class
 */
export class LinkedArticle{
    /**
     * The ID of the Linked Article
     */
    linkedArticleId: string;

    /**
     * The ID reference to the Study
     */
    studyId: string;

    /**
     * The article URL associated with the study
     */
    articleUrl: string;

    /**
     * Description of the linked article
     */
    description: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.linkedArticleId = data.linkedArticleId;
        this.studyId = data.studyId;
        this.articleUrl = data.articleUrl;
        this.description = data.description;
    }
}
