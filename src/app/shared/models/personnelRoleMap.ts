/**
 * Model for Transferring Personnel Role Maps
 */
export class PersonnelRoleMap {
    personnelRoles: {personId: string; roles: string[]}[];

    constructor(personnelRoleMap: Map<string, string[]>) {
        this.personnelRoles = Array.from(personnelRoleMap.entries()).map(([personId, roles]) => ({
            personId,
            roles
        }));
    }
}