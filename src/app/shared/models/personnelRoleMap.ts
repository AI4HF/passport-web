/**
 * Model for Transferring Personnel Role Maps
 */
export class PersonnelRoleMap {
    personnelRoles: {personId: String; roles: String[]}[];

    constructor(personnelRoleMap: Map<String, String[]>) {
        this.personnelRoles = Array.from(personnelRoleMap.entries()).map(([personId, roles]) => ({
            personId,
            roles
        }));
    }
}