/**
 * Model for password Parameter class
 */
export class Parameter{
    /**
     * The ID of the Parameter
     */
    parameterId: number;

    /**
     * The name of the Parameter
     */
    name: string;

    /**
     * The dataType of the Parameter
     */
    dataType: string;

    /**
     * The description of the Parameter
     */
    description: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.parameterId = data.parameterId;
        this.name = data.name;
        this.dataType = data.dataType;
        this.description = data.description;
    }
}