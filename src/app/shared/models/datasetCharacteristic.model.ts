export class DatasetCharacteristic {
    datasetId: number;
    featureId: number;
    characteristicName: string;
    value: string;
    valueDataType: string;

    constructor(data: any) {
        this.datasetId = data.datasetId;
        this.featureId = data.featureId;
        this.characteristicName = data.characteristicName;
        this.value = data.value;
        this.valueDataType = data.valueDataType;
    }
}
