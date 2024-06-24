import {NameAndValueInterface} from "./nameAndValue.interface";
import {Role} from "./role.enum";

/**
 * The list of roles
 */
export const ROLES: NameAndValueInterface[] = [
    { name: 'Data Provider', value: Role.DATA_PROVIDER },
    { name: 'Data Scientist', value: Role.DATA_SCIENTIST },
    { name: 'Organization', value: Role.ORGANIZATION },
    { name: 'Study Owner', value: Role.STUDY_OWNER}
];