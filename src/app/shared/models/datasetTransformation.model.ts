export class DatasetTransformation {
    dataTransformationId: number;
    title: string;
    description: string;

    constructor(data: any) {
        this.dataTransformationId = data.dataTransformationId;
        this.title = data.title;
        this.description = data.description;
    }
}
