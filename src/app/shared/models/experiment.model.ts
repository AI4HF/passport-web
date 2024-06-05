/**
 * Model for password Experiment class
 */
export class Experiment{
    /**
     * The ID of the Experiment
     */
    experimentId: number;

    /**
     * The ID reference to the Study
     */
    studyId: number;

    /**
     * The concrete research question to which an answer is sought with the ML workflow.
     */
    researchQuestion: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.experimentId = data.experimentId;
        this.studyId = data.studyId;
        this.researchQuestion = data.researchQuestion;
    }
}