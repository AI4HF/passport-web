export class Feature {
    featureId: number;
    featuresetId: number;
    title: string;
    description: string;
    dataType: string;
    featureType: string;
    mandatory: boolean;
    isUnique: boolean;
    units: string;
    equipment: string;
    dataCollection: string;
    createdAt: string;
    createdBy: number;
    lastUpdatedAt: string;
    lastUpdatedBy: number;

    constructor(data: any) {
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
