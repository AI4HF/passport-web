/**
 * Model for AuditLog class
 */
export class AuditLog {
    /**
     * The unique identifier of the AuditLog
     */
    auditLogId: string;

    /**
     * The ID of the personnel associated with this AuditLog
     */
    personId: string;

    /**
     * The ID of the personnel associated with this AuditLog
     */
    personName: string;

    /**
     * The timestamp of the event
     */
    occurredAt: Date;

    /**
     * The type of action (create, update, delete)
     */
    actionType: string;

    /**
     * The name of the affected table or relation
     */
    affectedRelation: string;

    /**
     * The ID of the affected record
     */
    affectedRecordId: string;

    /**
     * The record affected by the action
     */
    affectedRecord: string;

    /**
     * The description of the AuditLog
     */
    description: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.auditLogId = data.auditLogId;
        this.personId = data.personId;
        this.personName = data.personName;
        this.occurredAt = new Date(data.occurredAt);
        this.actionType = data.actionType;
        this.affectedRelation = data.affectedRelation;
        this.affectedRecordId = data.affectedRecordId;
        this.affectedRecord = data.affectedRecord;
        this.description = data.description;
    }
}
