/**
 * A controlled-vocabulary value the Data Steward records on a dataset.
 */
export class DatasetConcept {
    /**
     * The ID of the DatasetConcept
     */
    conceptId: string;

    /**
     * The ID of the dataset it describes
     */
    datasetId: string;

    /**
     * The HealthDCAT-AP property this value fills
     */
    propertyUri: string;

    /**
     * The URI of the concept
     */
    conceptUri: string;

    /**
     * The preferred label of the concept
     */
    prefLabel: string;

    /**
     * The scheme the concept comes from
     */
    conceptScheme: string;
    constructor(data: any) {
        if (!data) {
            return;
        }
        this.conceptId = data.conceptId;
        this.datasetId = data.datasetId;
        this.propertyUri = data.propertyUri;
        this.conceptUri = data.conceptUri;
        this.prefLabel = data.prefLabel;
        this.conceptScheme = data.conceptScheme;
    }
}
