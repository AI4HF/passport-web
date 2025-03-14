/**
 * Model for password Model class
 */
export class Model{
    /**
     * The ID of the Model
     */
    modelId: string;

    /**
     * The ID of the related Learning Process
     */
    learningProcessId: string;

    /**
     * The ID of the related Study
     */
    studyId: string;

    /**
     * The name of the Model
     */
    name: string;

    /**
     * The version of the Model
     */
    version: string;

    /**
     * The tag of the Model
     */
    tag: string;

    /**
     * The model type of the Model
     */
    modelType: string;

    /**
     * The product identifier of the Model
     */
    productIdentifier: string;

    /**
     * The owner of the Model
     */
    owner: string;

    /**
     * The trl level of the Model
     */
    trlLevel: string;

    /**
     * The license of the Model
     */
    license: string;

    /**
     * The primary use of the Model
     */
    primaryUse: string;

    /**
     * The secondary use of the Model
     */
    secondaryUse: string;

    /**
     * The intended users of the Model
     */
    intendedUsers: string;

    /**
     * The counter indications of the Model
     */
    counterIndications: string;

    /**
     * The ethical considerations of the Model
     */
    ethicalConsiderations: string;

    /**
     * The limitations of the Model
     */
    limitations: string;

    /**
     * The fairness constraints of the Model
     */
    fairnessConstraints: string;

    /**
     * The creation time of the Model
     */
    createdAt: Date;

    /**
     * The personnel id that created this model
     */
    createdBy: string;

    /**
     * The last update time of the Model
     */
    lastUpdatedAt: Date;

    /**
     * The last personnel id that updated this model
     */
    lastUpdatedBy: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.modelId = data.modelId;
        this.learningProcessId = data.learningProcessId;
        this.studyId = data.studyId;
        this.name = data.name;
        this.version = data.version;
        this.tag = data.tag;
        this.modelType = data.modelType;
        this.productIdentifier = data.productIdentifier;
        this.owner = data.owner;
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
        this.lastUpdatedAt = new Date(data.lastUpdatedAt);
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}