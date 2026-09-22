/**
 * The decision to publish a dataset, with the metadata that exists only for publication.
 */
export class CatalogueDataset {
    /**
     * The ID of the CatalogueDataset
     */
    catalogueDatasetId: string;

    /**
     * The ID of the dataset being published
     */
    datasetId: string;

    /**
     * The title as published
     */
    publicTitle: string;

    /**
     * The description as published
     */
    publicDescription: string;

    /**
     * The access rights statement
     */
    accessRights: string;

    /**
     * The responsible Health Data Access Body
     */
    hdabName: string;

    /**
     * The URI of that body
     */
    hdabUri: string;

    /**
     * The publishing organization
     */
    publisherName: string;

    /**
     * The type of publisher
     */
    publisherType: string;

    /**
     * Who to contact about the dataset
     */
    contactPoint: string;

    /**
     * The legal basis for processing
     */
    legalBasis: string;

    /**
     * The purpose the data may be used for
     */
    purpose: string;

    /**
     * Whether the dataset contains personal data
     */
    personalData: boolean;

    /**
     * Reference to the approval that allowed publication
     */
    publicationApprovalReference: string;

    /**
     * The legislation that applies
     */
    applicableLegislation: string;

    /**
     * Start of the retention period
     */
    retentionPeriodStart: string;

    /**
     * End of the retention period
     */
    retentionPeriodEnd: string;

    /**
     * The landing page of the dataset
     */
    landingPage: string;

    /**
     * Further documentation
     */
    documentation: string;

    /**
     * A quality annotation about the dataset
     */
    qualityAnnotation: string;

    /**
     * The creation date
     */
    createdAt: Date;

    /**
     * The actor that created it
     */
    createdBy: string;

    /**
     * The last update date
     */
    lastUpdatedAt: Date;

    /**
     * The actor that last updated it
     */
    lastUpdatedBy: string;
    constructor(data: any) {
        if (!data) {
            return;
        }
        this.catalogueDatasetId = data.catalogueDatasetId;
        this.datasetId = data.datasetId;
        this.publicTitle = data.publicTitle;
        this.publicDescription = data.publicDescription;
        this.accessRights = data.accessRights;
        this.hdabName = data.hdabName;
        this.hdabUri = data.hdabUri;
        this.publisherName = data.publisherName;
        this.publisherType = data.publisherType;
        this.contactPoint = data.contactPoint;
        this.legalBasis = data.legalBasis;
        this.purpose = data.purpose;
        this.personalData = data.personalData;
        this.publicationApprovalReference = data.publicationApprovalReference;
        this.applicableLegislation = data.applicableLegislation;
        this.retentionPeriodStart = data.retentionPeriodStart;
        this.retentionPeriodEnd = data.retentionPeriodEnd;
        this.landingPage = data.landingPage;
        this.documentation = data.documentation;
        this.qualityAnnotation = data.qualityAnnotation;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}
