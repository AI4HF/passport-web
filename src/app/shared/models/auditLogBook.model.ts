/**
 * Model for AuditLogBook class
 */
export class AuditLogBook {
    /**
     * The ID of the associated Passport
     */
    passportId: string;

    /**
     * The ID of the associated AuditLog
     */
    auditLogId: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.passportId = data.passportId;
        this.auditLogId = data.auditLogId;
    }
}
