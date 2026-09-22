/**
 * One accessible form of a published dataset.
 */
export class DatasetDistribution {
    /**
     * The ID of the DatasetDistribution
     */
    distributionId: string;

    /**
     * The publication record it belongs to
     */
    catalogueDatasetId: string;

    /**
     * The title of the distribution
     */
    title: string;

    /**
     * The description of the distribution
     */
    description: string;

    /**
     * Where the distribution can be reached
     */
    accessUrl: string;

    /**
     * Where it can be downloaded, when it can
     */
    downloadUrl: string;

    /**
     * The data service serving it
     */
    accessServiceUri: string;

    /**
     * The format
     */
    format: string;

    /**
     * The media type
     */
    mediaType: string;

    /**
     * How long it stays available
     */
    availability: string;

    /**
     * The status of the distribution
     */
    status: string;

    /**
     * The licence it is offered under
     */
    licence: string;

    /**
     * Any further rights statement
     */
    rights: string;

    /**
     * The size in bytes
     */
    byteSize: number;

    /**
     * The checksum algorithm
     */
    checksumAlgorithm: string;

    /**
     * The checksum value
     */
    checksumValue: string;

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
        this.distributionId = data.distributionId;
        this.catalogueDatasetId = data.catalogueDatasetId;
        this.title = data.title;
        this.description = data.description;
        this.accessUrl = data.accessUrl;
        this.downloadUrl = data.downloadUrl;
        this.accessServiceUri = data.accessServiceUri;
        this.format = data.format;
        this.mediaType = data.mediaType;
        this.availability = data.availability;
        this.status = data.status;
        this.licence = data.licence;
        this.rights = data.rights;
        this.byteSize = data.byteSize;
        this.checksumAlgorithm = data.checksumAlgorithm;
        this.checksumValue = data.checksumValue;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}
