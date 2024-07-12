export class Dataset {
    datasetId: number;
    featuresetId: number;
    populationId: number;
    organizationId: number;
    title: string;
    description: string;
    version: string;
    referenceEntity: string;
    numOfRecords: number;
    synthetic: boolean;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;

    constructor(data: any) {
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
