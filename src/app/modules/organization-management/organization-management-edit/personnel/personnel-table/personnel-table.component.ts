import {Component, Injector, Input, OnInit} from '@angular/core';
import { Personnel } from '../../../../../shared/models/personnel.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { ROLES } from '../../../../../shared/models/roles.constant';

/**
 * Component to display and manage a list of personnel.
 */
@Component({
    selector: 'app-personnel-table',
    templateUrl: './personnel-table.component.html',
    styleUrls: ['./personnel-table.component.scss']
})
export class PersonnelTableComponent extends BaseComponent implements OnInit {
    /** List of personnel */
    personnelList: Personnel[];
    /** Columns to be displayed in the table */
    columns: any[];
    /** Loading state of the table */
    loading: boolean = true;
    /** Determines if the form is displayed */
    displayForm: boolean = false;
    /** The ID of the selected personnel for editing */
    selectedPersonnelId: string;

    @Input() organizationId: string;
    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
        this.columns = [
            { header: 'First Name', field: 'firstName' },
            { header: 'Last Name', field: 'lastName' },
            { header: 'Role', field: 'role' },
            { header: 'E-Mail', field: 'email' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        if (this.organizationId) {
            this.loadPersonnelList(this.organizationId);
        }
    }

    /**
     * Loads the list of personnel for the given organization ID.
     * @param organizationId The ID of the organization
     */
    loadPersonnelList(organizationId: string) {
        this.personnelService.getPersonnelByOrganizationId(organizationId).pipe(takeUntil(this.destroy$)).subscribe({
            next: personnel => {
                this.personnelList = personnel;
            },
            error: (error) => {
                this.loading = false;
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Filters the table based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Shows the form for creating new personnel.
     */
    createPersonnel() {
        this.selectedPersonnelId = null;
        this.displayForm = true;
    }

    /**
     * Shows the form for editing existing personnel.
     * @param personnel The personnel to be edited
     */
    editPersonnel(personnel: Personnel) {
        this.selectedPersonnelId = personnel.personId;
        this.displayForm = true;
    }

    /**
     * Deletes the selected personnel.
     * Handles specific conflict errors.
     * @param personId The ID of the personnel to be deleted
     */
    deletePersonnel(personId: string) {
        this.personnelService.deletePersonnel(personId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.personnelList = this.personnelList.filter(p => p.personId !== personId);
                this.translateService.get(['Success', 'OrganizationManagement.Personnel is deleted successfully']).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations['OrganizationManagement.Personnel is deleted successfully']
                    });
                });
                if (this.organizationId) {
                    this.loadPersonnelList(this.organizationId);
                }
            },
            error: (error) => {
                if (error.status === 409) {
                    const backendMessage = error.error;

                    if (backendMessage && backendMessage.includes('Owner')) {
                        this.translateService.get(['Error', 'OrganizationManagement.Error.StudyOwnerDeletion']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translations['Error'],
                                detail: translations['OrganizationManagement.Error.StudyOwnerDeletion']
                            });
                        });
                    } else if (backendMessage && backendMessage.includes('Responsible Personnel')) {
                        this.translateService.get(['Error', 'OrganizationManagement.Error.ResponsiblePersonnelDeletion']).subscribe(translations => {
                            this.messageService.add({
                                severity: 'error',
                                summary: translations['Error'],
                                detail: translations['OrganizationManagement.Error.ResponsiblePersonnelDeletion']
                            });
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: backendMessage || error.message
                        });
                    }
                } else {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            }
        });
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        if (this.organizationId) {
            this.loadPersonnelList(this.organizationId);
        }
    }

    /**
     * Converts a role string to a more readable format.
     * @param role The role string to convert
     * @returns The readable role string
     */
    toReadableRole(role: string): string {
        const roleObj = ROLES.find(r => r.value === role);
        return roleObj ? roleObj.name : role;
    }
}