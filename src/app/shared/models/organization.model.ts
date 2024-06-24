export class Organization {
    id: number;
    name: string;
    address: string;

    constructor(data: any) {
        this.id = data.organizationId;
        this.name = data.name;
        this.address = data.address;
    }
}
