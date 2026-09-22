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
    numberOfRecords: number;

    /**
     * Indicates if the Dataset is synthetic
     */
    synthetic: boolean;

    /**
     * The dataset version this one refreshed, if any
     */
    previousDatasetId: string;

    /**
     * The persistent identifier of the dataset
     */
    persistentIdentifier: string;

    /**
     * Whether the dataset is structured
     */
    structuredData: boolean;

    /**
     * Start of the period the data covers
     */
    temporalCoverageStart: string;

    /**
     * End of the period the data covers
     */
    temporalCoverageEnd: string;

    /**
     * The temporal resolution of the data
     */
    temporalResolution: string;

    /**
     * The geographical area the data covers
     */
    geographicalCoverage: string;

    /**
     * The number of unique individuals represented
     */
    numberOfUniqueIndividuals: number;

    /**
     * The lowest typical age represented
     */
    minTypicalAge: number;

    /**
     * The highest typical age represented
     */
    maxTypicalAge: number;

    /**
     * The standard the dataset conforms to
     */
    conformsTo: string;

    /**
     * How the dataset came about
     */
    provenanceStatement: string;

    /**
     * The activity that generated the dataset
     */
    wasGeneratedBy: string;

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
        this.numberOfRecords = data.numberOfRecords;
        this.synthetic = data.synthetic;
        this.previousDatasetId = data.previousDatasetId;
        this.persistentIdentifier = data.persistentIdentifier;
        this.structuredData = data.structuredData;
        this.temporalCoverageStart = data.temporalCoverageStart;
        this.temporalCoverageEnd = data.temporalCoverageEnd;
        this.temporalResolution = data.temporalResolution;
        this.geographicalCoverage = data.geographicalCoverage;
        this.numberOfUniqueIndividuals = data.numberOfUniqueIndividuals;
        this.minTypicalAge = data.minTypicalAge;
        this.maxTypicalAge = data.maxTypicalAge;
        this.conformsTo = data.conformsTo;
        this.provenanceStatement = data.provenanceStatement;
        this.wasGeneratedBy = data.wasGeneratedBy;
        this.createdAt = data.createdAt;
        this.createdBy = data.createdBy;
        this.lastUpdatedAt = data.lastUpdatedAt;
        this.lastUpdatedBy = data.lastUpdatedBy;
    }
}

