import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditLog } from '../../../shared/models/auditLog.model';
import { AuditLogBookService } from '../../../core/services/audit-log-book.service';

/**
 * Component for displaying audit logs using a timeline with pagination.
 */
@Component({
    selector: 'app-audit-log-table',
    templateUrl: './audit-log-table.component.html',
    styleUrls: ['./audit-log-table.component.scss'],
})
export class AuditLogTableComponent implements OnInit {
    /** List of all audit logs */
    auditLogs: AuditLog[] = [];
    /** List of audit logs to display for the current page */
    pagedAuditLogs: AuditLog[] = [];
    /** Flag indicating whether data is loading */
    loading: boolean = true;
    /** Number of rows per page for pagination */
    rowsPerPage: number = 10;
    /** Current page index for pagination */
    currentPage: number = 0;

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
     * Populates the first page on load.
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
                const auditLogIds = auditLogBooks.map((logBook) => logBook.auditLogId);
                this.auditLogBookService.getAuditLogsByIds(auditLogIds).subscribe({
                    next: (logs) => {
                        this.auditLogs = logs.reverse();
                        this.updatePagedAuditLogs();
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
     * Updates the `pagedAuditLogs` based on the current page and rows per page.
     * This method slices the full log list into the subset required for pagination.
     */
    updatePagedAuditLogs(): void {
        const startIndex = this.currentPage * this.rowsPerPage;
        const endIndex = startIndex + this.rowsPerPage;
        this.pagedAuditLogs = this.auditLogs.slice(startIndex, endIndex);
    }

    /**
     * Handles page change events triggered by the paginator.
     * Updates the current page and refreshes the displayed logs.
     * @param event Contains pagination details such as first row and rows per page
     */
    onPageChange(event: any): void {
        this.currentPage = event.page;
        this.rowsPerPage = event.rows;
        this.updatePagedAuditLogs();
    }

    /**
     * Navigates back to the passport management table.
     */
    goBack(): void {
        this.router.navigate(['/passport-management']);
    }
}