/**
 * Model for passport Dataset class
 */
export class Dataset {
    /**
     * The ID of the Dataset
     */
    datasetId: string;

    /**
     * The ID of the associated FeatureSet
     */
    featuresetId: string;

    /**
     * The ID of the associated Population
     */
    populationId: string;

    /**
     * The ID of the associated Organization
     */
    organizationId: string;

    /**
     * The title of the Dataset
     */
    title: string;

    /**
     * The description of the Dataset
     */
    description: string;

    /**
     * The version of the Dataset
     */
    version: string;

    /**
     * The reference entity of the Dataset
     */
    referenceEntity: string;

    /**
     * The number of records in the Dataset
     */
    numOfRecords: number;

    /**
     * Indicates if the Dataset is synthetic
     */
    synthetic: boolean;

    /**
     * The creation timestamp of the Dataset
     */
    createdAt: Date;

    /**
     * The ID of the user who created the Dataset
     */
    createdBy: string;

    /**
     * The last update timestamp of the Dataset
     */
    lastUpdatedAt: Date;

    /**
     * The ID of the user who last updated the Dataset
     */
    lastUpdatedBy: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.datasetId = data.datasetId;
        this.featuresetId = data.featuresetId;
        this.populationId = data.populationId;
        this.organizationId = data.organizationId;
        this.title = data.title;
        this.description = data.description;
        this.version = data.version;
        this.referenceEntity = data.referenceEntity;
        this.numOfRecords = data.numOfRecords;
        this.synthetic = data.synthetic;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}

