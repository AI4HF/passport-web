export class Organization {
    id: number;
    name: string;
    address: string;

    constructor(data: any) {
        this.id = data.id;
        this.name = data.name;
        this.address = data.address;
    }
}
