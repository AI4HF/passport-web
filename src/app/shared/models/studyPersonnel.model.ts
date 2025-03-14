import { Role } from './role.enum';

/**
 * Model representing the relationship between a Study and Personnel,
 * including the roles that a personnel has within the study.
 */
export class StudyPersonnel {
    /**
     * The composite ID of the study and personnel associated with this entry.
     */
    id: {
        studyId: string;
        personnelId: string;
    };

    /**
     * The roles as a single string (comma-separated).
     */
    role: string;

    /**
     * The roles parsed into a list.
     */
    rolesAsList: Role[] = [];

    /**
     * Constructs a new StudyPersonnel object.
     * @param data Optional data object to initialize the StudyPersonnel instance.
     */
    constructor(data: any) {
        if (data) {
            this.id = data.id || { studyId: 0, personnelId: '' };
            this.role = data.role || '';
            this.setRolesAsList();
        }
    }

    /**
     * Parses the roles string into a list and sets it to rolesAsList.
     */
    setRolesAsList(): void {
        if (this.role) {
            this.rolesAsList = this.role.split(',')
                .map(role => role.trim() as Role)
                .filter(role => !!role); // Remove any empty strings
        }
    }

    /**
     * Retrieves the roles as a string by joining the list of roles with commas.
     * @return A string of comma-separated roles.
     */
    getRolesAsString(): string {
        return this.rolesAsList.join(',');
    }

    /**
     * Sets the roles from a comma-separated string.
     * @param rolesString A string of comma-separated roles.
     */
    setRolesFromstring(rolesString: string): void {
        this.role = rolesString;
        this.setRolesAsList();
    }

    /**
     * Gets the study ID from the nested id object.
     * @return The study ID.
     */
    getStudyId(): string {
        return this.id.studyId;
    }

    /**
     * Gets the personnel ID from the nested id object.
     * @return The personnel ID.
     */
    getPersonnelId(): string {
        return this.id.personnelId;
    }
}
