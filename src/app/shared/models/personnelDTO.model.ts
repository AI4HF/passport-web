import {Personnel} from "./personnel.model";
import {Credentials} from "./credentials.model";


/**
 * Model for creating Personnel
 */
export class PersonnelDTO {

    /**
     * The Personnel information
     */
    personnel: Personnel;

    /**
     * The Credentials of the user
     */
    credentials: Credentials;

    /**
     * Boolean value of whether the user is a study owner.
     */
    role: boolean;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.personnel = new Personnel(data.personnel);
        this.credentials = new Credentials(data.credentials);
        this.role = data.role.role;
    }
}