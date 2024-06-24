import {Role} from "./role.enum";

/**
 * Model for password Personnel class
 */
export class Personnel{
    /**
     * The ID of the Personnel
     */
    personId: number;

    /**
     * The ID reference to the Organization
     */
    organizationId: number;

    /**
     * The first name of the Personnel
     */
    firstName: string;

    /**
     * The last name of the Personnel
     */
    lastName: string;

    /**
     * The role of the Personnel
     */
    role: Role;

    /**
     * The e-mail of the Personnel
     */
    email: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.personId = data.personId;
        this.organizationId = data.organizationId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.role = data.role;
        this.email = data.email;
    }

    /**
     * Checks if this Personnel is equal to another Personnel based on personId.
     * @param other The other Personnel to compare with.
     * @returns true if equal, false otherwise.
     */
    equals(other: Personnel): boolean {
        if (!other) {
            return false;
        }
        return this.personId === other.personId;
    }
}