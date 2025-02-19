import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditLog } from '../../../shared/models/auditLog.model';
import { AuditLogBookService } from '../../../core/services/audit-log-book.service';

/**
 * Component for displaying audit logs in a table with date range filtering and search.
 */
@Component({
    selector: 'app-audit-log-table',
    templateUrl: './audit-log-table.component.html',
    styleUrls: ['./audit-log-table.component.scss'],
})
export class AuditLogTableComponent implements OnInit {
    /** List of all audit logs */
    auditLogs: AuditLog[] = [];
    /** Filtered list of audit logs to display */
    filteredAuditLogs: AuditLog[] = [];
    /** Flag indicating whether data is loading */
    loading: boolean = true;

    /** Search text for filtering action type and affected relation */
    searchText: string = '';

    /** Start date filter value */
    startDate: Date | null = null;
    /** End date filter value */
    endDate: Date | null = null;

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
                const auditLogIds = auditLogBooks.map((logBook) => logBook.auditLogId);
                this.auditLogBookService.getAuditLogsByIds(auditLogIds).subscribe({
                    next: (logs) => {
                        this.auditLogs = logs.reverse();
                        this.filteredAuditLogs = this.auditLogs;
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
     * Updates the filteredAuditLogs based on search text and date range filters.
     */
    updateFilters(): void {
        let filtered = this.auditLogs;

        // Apply search filter on actionType, personName, description, and affectedRelation
        if (this.searchText && this.searchText.trim() !== '') {
            const search = this.searchText.toLowerCase();
            filtered = filtered.filter(
                (item) =>
                    (item.description && item.description.toLowerCase().includes(search)) ||
                    (item.personName && item.personName.toLowerCase().includes(search)) ||
                    (item.actionType && item.actionType.toLowerCase().includes(search)) ||
                    (item.affectedRelation && item.affectedRelation.toLowerCase().includes(search))
            );
        }

        // Apply date range filter on occurredAt
        if (this.startDate || this.endDate) {
            filtered = filtered.filter((item) => {
                const itemDate = new Date(item.occurredAt);
                if (this.startDate && this.endDate) {
                    return itemDate >= this.startDate && itemDate <= this.endDate;
                } else if (this.startDate) {
                    return itemDate >= this.startDate;
                } else if (this.endDate) {
                    return itemDate <= this.endDate;
                }
                return true;
            });
        }

        this.filteredAuditLogs = filtered;
    }

    /**
     * Event handler for search input changes.
     * @param event Input event
     */
    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchText = input.value;
        this.updateFilters();
    }

    /**
     * Invoked whenever the start or end date changes (including clearing).
     */
    onDateSelect(): void {
        this.updateFilters();
    }

    /**
     * Navigates back to the passport management table.
     */
    goBack(): void {
        this.router.navigate(['/passport-management']);
    }
}
