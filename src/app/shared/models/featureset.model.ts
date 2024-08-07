/**
 * Model for passport FeatureSet class
 */
export class FeatureSet {
    /**
     * The ID of the FeatureSet
     */
    featuresetId: number;

    /**
     * The ID of the associated Experiment
     */
    experimentId: number;

    /**
     * The title of the FeatureSet
     */
    title: string;

    /**
     * The URL of the FeatureSet
     */
    featuresetURL: string;

    /**
     * The description of the FeatureSet
     */
    description: string;

    /**
     * The creation timestamp of the FeatureSet
     */
    createdAt: Date;

    /**
     * The ID of the user who created the FeatureSet
     */
    createdBy: string;

    /**
     * The last update timestamp of the FeatureSet
     */
    lastUpdatedAt: Date;

    /**
     * The ID of the user who last updated the FeatureSet
     */
    lastUpdatedBy: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.featuresetId = data.featuresetId;
        this.experimentId = data.experimentId;
        this.title = data.title;
        this.featuresetURL = data.featuresetURL;
        this.description = data.description;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}

