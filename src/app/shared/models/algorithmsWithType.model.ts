import {Algorithm} from "./algorithm.model";

/**
 * Model for Dataset with associated LearningDatasets.
 */
export class AlgorithmsWithType {

    /**
     * The type of the connected Algorithms.
     */
    type: string;

    /**
     * The list of Algorithms associated with the type.
     */
    algorithms: Algorithm[];

    constructor(data: any) {
        if (!data) {
            return;
        }

        this.type = data.type;
        this.algorithms = data.algorithms.map((algorithm: any) => new Algorithm(algorithm));
    }
}