/**
 * Model for passport Organization class
 */
export class Organization {
    /**
     * The ID of Organization
     */
    organizationId: string;

    /**
     * The name of Organization
     */
    name: string;

    /**
     * The address of Organization
     */
    address: string;

    /**
     * The ID of Organization Admin
     */
    organizationAdminId: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.organizationId = data.organizationId;
        this.name = data.name;
        this.address = data.address;
        this.organizationAdminId = data.organizationAdminId;
    }
}
