/**
 * Model for passport DatasetCharacteristic class
 */
export class DatasetCharacteristic {
    /**
     * The ID of the associated Dataset
     */
    datasetId: string;

    /**
     * The ID of the associated Feature
     */
    featureId: string;

    /**
     * The name of the characteristic
     */
    characteristicName: string;

    /**
     * The value of the characteristic
     */
    value: string;

    /**
     * The data type of the value
     */
    valueDataType: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.datasetId = data.datasetId;
        this.featureId = data.featureId;
        this.characteristicName = data.characteristicName;
        this.value = data.value;
        this.valueDataType = data.valueDataType;
    }
}

