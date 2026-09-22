/**
 * Model for QualityCriteria class: a versioned set of data quality rules for an Experiment,
 * synced from the declarative definition that the quality execution runs.
 */
export class QualityCriteria {
    /**
     * The ID of the QualityCriteria
     */
    qualityCriteriaId: string;

    /**
     * The ID of the Experiment the criteria belong to
     */
    experimentId: string;

    /**
     * The title of the criteria set
     */
    title: string;

    /**
     * The canonical URL of the declarative definition
     */
    url: string;

    /**
     * The description of the criteria set
     */
    description: string;

    /**
     * The version of the declarative definition
     */
    version: string;

    /**
     * The creation date
     */
    createdAt: Date;

    /**
     * The ID of the actor that created it
     */
    createdBy: string;

    /**
     * The last update date
     */
    lastUpdatedAt: Date;

    /**
     * The ID of the actor that last updated it
     */
    lastUpdatedBy: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.qualityCriteriaId = data.qualityCriteriaId;
        this.experimentId = data.experimentId;
        this.title = data.title;
        this.url = data.url;
        this.description = data.description;
        this.version = data.version;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}
