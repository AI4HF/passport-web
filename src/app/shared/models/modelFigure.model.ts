/**
 * Model for ModelFigure class
 */
export class ModelFigure {
    /**
     * The ID of the related Model
     */
    modelId: string;

    /**
     * The ID of the ModelFigure
     */
    figureId: string;

    /**
     * The figure image encoded as base64
     */
    imageBase64: string;

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.modelId = data.modelId;
        this.figureId = data.figureId;
        this.imageBase64 = data.imageBase64;
    }
}
