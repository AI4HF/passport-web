export class FeatureSet {
    featuresetId: number;
    experimentId: number;
    title: string;
    featuresetURL: string;
    description: string;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;

    constructor(data: any) {
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
