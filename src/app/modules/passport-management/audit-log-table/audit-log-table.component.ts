import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditLog } from '../../../shared/models/auditLog.model';
import {AuditLogBookService} from "../../../core/services/audit-log-book.service";


/**
 * Component for displaying audit logs in a table.
 */
@Component({
    selector: 'app-audit-log-table',
    templateUrl: './audit-log-table.component.html',
    styleUrls: ['./audit-log-table.component.scss'],
})
export class AuditLogTableComponent implements OnInit {
    /** List of audit logs to display */
    auditLogs: AuditLog[] = [];
    /** Flag indicating whether data is loading */
    loading: boolean = true;

    /**
     * Constructor to inject dependencies.
     * @param auditLogBookService Service for managing audit logs
     * @param route Activated route for fetching parameters
     * @param router Router for navigation
     */
    constructor(
        private auditLogBookService: AuditLogBookService,
        private route: ActivatedRoute,
        private router: Router
    ) {}

    /**
     * Initializes the component by loading the audit logs.
     */
    ngOnInit(): void {
        const passportId = this.route.snapshot.paramMap.get('passportId');
        if (passportId) {
            this.loadAuditLogs(passportId);
        }
    }

    /**
     * Loads the audit logs associated with a given passport ID.
     * @param passportId The ID of the passport
     */
    loadAuditLogs(passportId: string): void {
        this.auditLogBookService.getAllByPassportId(passportId).subscribe({
            next: (auditLogBooks) => {
                // Map all AuditLogBook entries to extract only the AuditLog IDs
                const auditLogIds = auditLogBooks.map((logBook) => logBook.auditLogId);

                // Fetch the AuditLogs using the list of AuditLog IDs
                this.auditLogBookService.getAuditLogsByIds(auditLogIds).subscribe({
                    next: (logs) => {
                        this.auditLogs = logs;
                    },
                    error: (error) => {
                        console.error('Error fetching audit logs:', error);
                    },
                    complete: () => {
                        this.loading = false;
                    },
                });
            },
            error: (error) => {
                console.error('Error fetching audit log books:', error);
                this.loading = false;
            },
        });
    }


    /**
     * Navigates back to the passport management table.
     */
    goBack(): void {
        this.router.navigate(['/passport-management']);
    }
}
