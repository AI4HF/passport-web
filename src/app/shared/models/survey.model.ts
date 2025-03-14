/**
 * Model for password Survey class
 */
export class Survey{
    /**
     * The ID of the Survey
     */
    surveyId: string;

    /**
     * The related study id
     */
    studyId: string;

    /**
     * The question of the Survey
     */
    question: string;

    /**
     * The answer of the Survey
     */
    answer: string;

    /**
     * The question category of the Survey
     */
    category: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.surveyId = data.surveyId;
        this.studyId = data.studyId;
        this.question = data.question;
        this.answer = data.answer;
        this.category = data.category;
    }
}