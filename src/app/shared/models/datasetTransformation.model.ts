/**
 * Model for passport DatasetTransformation class
 */
export class DatasetTransformation {
    /**
     * The ID of the DatasetTransformation
     */
    dataTransformationId: number;

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
        this.dataTransformationId = data.dataTransformationId;
        this.title = data.title;
        this.description = data.description;
    }
}

