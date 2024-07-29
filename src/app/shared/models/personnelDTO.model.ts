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

    constructor(data: any) {

        if(!data){
            return;
        }

        this.personnel = new Personnel(data.personnel);
        this.credentials = new Credentials(data.credentials);
    }
}