/**
 * Model for passport LinkedArticle class
 */
export class LinkedArticle{
    /**
     * The ID of the Linked Article
     */
    articleId: string;

    /**
     * The ID reference to the Model
     */
    modelId: string;

    /**
     * The DOI of the article
     */
    doi: string;

    /**
     * The title of the article
     */
    title: string;

    /**
     * The authors of the article
     */
    authors: string;

    /**
     * The journal or conference the article appeared in
     */
    publicationVenue: string;

    /**
     * The year the article was published
     */
    publicationYear: number;

    /**
     * The URL the article can be reached at
     */
    url: string;

    /**
     * Description of the linked article
     */
    description: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.articleId = data.articleId;
        this.modelId = data.modelId;
        this.doi = data.doi;
        this.title = data.title;
        this.authors = data.authors;
        this.publicationVenue = data.publicationVenue;
        this.publicationYear = data.publicationYear;
        this.url = data.url;
        this.description = data.description;
    }
}
