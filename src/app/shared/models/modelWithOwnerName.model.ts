/**
 * Model for the Model projection the passport carries, where the owning organization is resolved to its
 * name rather than its ID.
 */
export class ModelWithOwnerName {
    modelId: string;
    learningProcessId: string;
    studyId: string;
    experimentId: string;
    name: string;
    version: string;

    /** The ID of the Model version this one was retrained from */
    previousModelId: string;

    /** Why the Model was retrained */
    retrainingReason: string;

    tag: string;
    modelType: string;
    productIdentifier: string;

    /** The name of the Organization owning the Model */
    ownerOrganizationName: string;

    trlLevel: string;
    license: string;
    primaryUse: string;
    secondaryUse: string;
    intendedUsers: string;
    counterIndications: string;
    ethicalConsiderations: string;
    limitations: string;
    fairnessConstraints: string;
    createdAt: Date;
    createdBy: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.modelId = data.modelId;
        this.learningProcessId = data.learningProcessId;
        this.studyId = data.studyId;
        this.experimentId = data.experimentId;
        this.name = data.name;
        this.version = data.version;
        this.previousModelId = data.previousModelId;
        this.retrainingReason = data.retrainingReason;
        this.tag = data.tag;
        this.modelType = data.modelType;
        this.productIdentifier = data.productIdentifier;
        this.ownerOrganizationName = data.ownerOrganizationName;
        this.trlLevel = data.trlLevel;
        this.license = data.license;
        this.primaryUse = data.primaryUse;
        this.secondaryUse = data.secondaryUse;
        this.intendedUsers = data.intendedUsers;
        this.counterIndications = data.counterIndications;
        this.ethicalConsiderations = data.ethicalConsiderations;
        this.limitations = data.limitations;
        this.fairnessConstraints = data.fairnessConstraints;
        this.createdAt = new Date(data.createdAt);
        this.createdBy = data.createdBy;
    }
}
