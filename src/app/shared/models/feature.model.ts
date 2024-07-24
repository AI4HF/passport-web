/**
 * Model for passport Feature class
 */
export class Feature {
    /**
     * The ID of the Feature
     */
    featureId: number;

    /**
     * The ID of the associated FeatureSet
     */
    featuresetId: number;

    /**
     * The title of the Feature
     */
    title: string;

    /**
     * The description of the Feature
     */
    description: string;

    /**
     * The data type of the Feature
     */
    dataType: string;

    /**
     * The feature type of the Feature
     */
    featureType: string;

    /**
     * Indicates if the Feature is mandatory
     */
    mandatory: boolean;

    /**
     * Indicates if the Feature is unique
     */
    isUnique: boolean;

    /**
     * The units of the Feature
     */
    units: string;

    /**
     * The equipment associated with the Feature
     */
    equipment: string;

    /**
     * The data collection method for the Feature
     */
    dataCollection: string;

    /**
     * The creation timestamp of the Feature
     */
    createdAt: string;

    /**
     * The ID of the user who created the Feature
     */
    createdBy: number;

    /**
     * The last update timestamp of the Feature
     */
    lastUpdatedAt: string;

    /**
     * The ID of the user who last updated the Feature
     */
    lastUpdatedBy: number;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.featureId = data.featureId;
        this.featuresetId = data.featuresetId;
        this.title = data.title;
        this.description = data.description;
        this.dataType = data.dataType;
        this.featureType = data.featureType;
        this.mandatory = data.mandatory;
        this.isUnique = data.isUnique;
        this.units = data.units;
        this.equipment = data.equipment;
        this.dataCollection = data.dataCollection;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}

