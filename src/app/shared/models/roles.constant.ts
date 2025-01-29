import {NameAndValueInterface} from "./nameAndValue.interface";
import {Role} from "./role.enum";

/**
 * The list of roles
 */
export const ROLES: NameAndValueInterface[] = [
    { name: 'Data Scientist', value: Role.DATA_SCIENTIST },
    { name: 'Study Owner', value: Role.STUDY_OWNER},
    { name: 'Survey Manager', value: Role.SURVEY_MANAGER },
    { name: 'Data Engineer', value: Role.DATA_ENGINEER },
    { name: 'Quality Assurance Specialist', value: Role.QUALITY_ASSURANCE_SPECIALIST },
    { name: "ML Engineer", value: Role. ML_ENGINEER}
];