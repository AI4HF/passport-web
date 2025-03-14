import {Role} from "./role.enum";

/**
 * Model for studyOrganization class
 */
export class StudyOrganization {
    /**
     * The ID reference to the Organization
     */
    organizationId: string;

    /**
     * The ID reference to the Study
     */
    studyId: string;

    /**
     * The ID reference to the Personnel
     */
    personnelId: string;

    /**
     * The available roles for studyOrganization
     */
    roles: Role[];

    /**
     * The ID reference to the Population
     */
    populationId: string;

    constructor(data: any) {

        if(!data){
            return;
        }
        this.organizationId = data.organizationId;
        this.studyId = data.studyId;
        this.personnelId = data.personnelId;
        this.roles = data.roles?.map((role: string) => Role[role as keyof typeof Role]) || [];
        this.populationId = data.populationId;
    }
}