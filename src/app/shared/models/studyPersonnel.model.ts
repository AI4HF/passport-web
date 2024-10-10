import { Role } from './role.enum';

/**
 * Model representing the relationship between a Study and Personnel,
 * including the roles that a personnel has within the study.
 */
export class StudyPersonnel {

    /**
     * The ID of the study associated with this entry.
     */
    studyId: number;

    /**
     * The ID of the personnel associated with this entry.
     */
    personnelId: string;

    /**
     * The list of roles assigned to the personnel for this study.
     * This is represented as a list of Role enumerables.
     */
    roles: Role[];

    /**
     * Constructs a new StudyPersonnel object.
     * @param data Optional data object to initialize the StudyPersonnel instance.
     */
    constructor(data: any) {
        if (data) {
            this.studyId = data.studyId;
            this.personnelId = data.personnelId;
            this.roles = data.roles;
        }
    }

    /**
     * Retrieves the roles as a string by joining the list of roles with commas.
     * @return A string of comma-separated roles.
     */
    getRolesAsString(): string {
        return this.roles.map(role => Role[role]).join(',');
    }

    /**
     * Sets the roles from a comma-separated string.
     * @param rolesString A string of comma-separated roles.
     */
    setRolesFromString(rolesString: string): void {
        this.roles = rolesString.split(',').map(role => Role[role as keyof typeof Role]);
    }
}
