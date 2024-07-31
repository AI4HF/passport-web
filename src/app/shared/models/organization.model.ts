/**
 * Model for passport Organization class
 */
export class Organization {
    /**
     * The ID of Organization
     */
    organizationId: number;

    /**
     * The name of Organization
     */
    name: string;

    /**
     * The address of Organization
     */
    address: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.organizationId = data.organizationId;
        this.name = data.name;
        this.address = data.address;
    }
}
