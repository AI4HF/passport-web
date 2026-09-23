/**
 * The record of publishing a dataset to one catalogue.
 */
export class CatalogueRegistration {
    /**
     * The ID of the CatalogueRegistration
     */
    registrationId: string;

    /**
     * The publication record it belongs to
     */
    catalogueDatasetId: string;

    /**
     * Which catalogue was written to
     */
    catalogueType: string;

    /**
     * The URI of the entry in that catalogue
     */
    catalogueUri: string;

    /**
     * When it was listed
     */
    listingDate: Date;

    /**
     * created or updated
     */
    changeType: string;

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
        this.registrationId = data.registrationId;
        this.catalogueDatasetId = data.catalogueDatasetId;
        this.catalogueType = data.catalogueType;
        this.catalogueUri = data.catalogueUri;
        this.listingDate = data.listingDate;
        this.changeType = data.changeType;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}
