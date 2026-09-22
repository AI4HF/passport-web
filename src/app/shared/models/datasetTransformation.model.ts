/**
 * Model for passport DatasetTransformation class
 */
export class DatasetTransformation {
    /**
     * The ID of the DatasetTransformation
     */
    datasetTransformationId: string;

    /**
     * The ID of the Study the transformation belongs to
     */
    studyId: string;

    /**
     * The title of the DatasetTransformation
     */
    title: string;

    /**
     * The description of the DatasetTransformation
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.datasetTransformationId = data.datasetTransformationId;
        this.studyId = data.studyId;
        this.title = data.title;
        this.description = data.description;
    }
}

