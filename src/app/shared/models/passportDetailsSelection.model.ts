/**
 * Model for details that will include in passport
 */
export class PassportDetailsSelection{
    /**
     * Whether include model details
     */
    modelDetails: boolean;

    /**
     * Whether include model deployment details
     */
    modelDeploymentDetails: boolean;

    /**
     * Whether include environment details
     */
    environmentDetails: boolean;

    /**
     * Whether include datasets
     */
    datasets: boolean;

    /**
     * Whether include featuresets
     */
    featureSets: boolean;

    /**
     * Whether include learning process details
     */
    learningProcessDetails: boolean;

    /**
     * Whether include parameter details
     */
    parameterDetails: boolean;

    /**
     * Whether include population details
     */
    populationDetails: boolean;

    /**
     * Whether include experiment details
     */
    experimentDetails: boolean;

    /**
     * Whether include survey details
     */
    surveyDetails: boolean;

    /**
     * Whether include study details
     */
    studyDetails: boolean;

    /**
     * Whether include evaluation measures
     */
    evaluationMeasures: boolean;

    /**
     * Whether clear empty fields or not
     */
    excludeEmptyFields: boolean;


    constructor(data: any) {

        if(!data){
            return;
        }

        this.modelDetails = data.modelDetails;
        this.modelDeploymentDetails = data.modelDeploymentDetails;
        this.environmentDetails = data.environmentDetails;
        this.datasets = data.datasets;
        this.featureSets = data.featureSets;
        this.learningProcessDetails = data.learningProcessDetails;
        this.parameterDetails = data.parameterDetails;
        this.populationDetails = data.populationDetails;
        this.experimentDetails = data.experimentDetails;
        this.surveyDetails = data.surveyDetails;
        this.studyDetails = data.studyDetails;
        this.evaluationMeasures = data.evaluationMeasures;
        this.excludeEmptyFields = data.excludeEmptyFields;

    }
}
