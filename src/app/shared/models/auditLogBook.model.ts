/**
 * Model for AuditLogBook class
 */
export class AuditLogBook {
    /**
     * The ID of the associated Passport
     */
    passportId: number;

    /**
     * The ID of the associated AuditLog
     */
    auditLogId: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.passportId = data.id.passportId;
        this.auditLogId = data.id.auditLogId;
    }
}
