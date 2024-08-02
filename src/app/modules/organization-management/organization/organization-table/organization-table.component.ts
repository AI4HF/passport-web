import { Component, Injector, OnInit } from '@angular/core';
import { Organization } from '../../../../shared/models/organization.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';

/**
 * Component to display and manage an organization.
 */
@Component({
    selector: 'app-organization-table',
    templateUrl: './organization-table.component.html',
    styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent extends BaseComponent implements OnInit {
    /** The currently selected organization */
    organization: Organization = null;
    /** Flags for editing organization details */
    isEditingName = false;
    isEditingAddress = false;
    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Initializes the component.
     */
    ngOnInit(): void {
        this.loadOrganizationDetails();
    }

    /**
     * Loads the details of all organizations.
     */
    loadOrganizationDetails(): void {
        this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
            next: (orgs) => {
                if (orgs.length > 0) {
                    this.organization = orgs[0];
                    this.organizationStateService.setOrganizationId(orgs[0].organizationId);
                } else {
                    this.organization = null;
                }
            },
            error: () => {
                this.organization = null;
            }
        });
    }

    /**
     * Toggles the editing state of the organization name.
     */
    toggleName(): void {
        this.isEditingName = !this.isEditingName;
        if (!this.isEditingName) {
            this.updateOrganizationField('name');
        }
    }

    /**
     * Toggles the editing state of the organization address.
     */
    toggleAddress(): void {
        this.isEditingAddress = !this.isEditingAddress;
        if (!this.isEditingAddress) {
            this.updateOrganizationField('address');
        }
    }

    /**
     * Updates a specific field of the organization.
     * @param field The field to be updated
     */
    updateOrganizationField(field: string): void {
        const updatedOrganization = { ...this.organization };

        if (field === 'name') {
            updatedOrganization.name = this.organization.name;
        } else if (field === 'address') {
            updatedOrganization.address = this.organization.address;
        }

        this.saveOrganization(updatedOrganization);
    }

    /**
     * Shows the form for creating or updating an organization.
     */
    showCreateUpdateDialog(): void {
        this.displayForm = true;
    }

    /**
     * Saves the organization details.
     * @param organization The organization details to be saved
     */
    saveOrganization(organization: Organization): void {
        this.organizationService.updateOrganization(organization).pipe(takeUntil(this.destroy$)).subscribe({
            next: (updatedOrg) => {
                this.organization = updatedOrg;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('Success'),
                    detail: this.translateService.instant('OrganizationManagement.Organization is updated successfully')
                });
                this.loadOrganizationDetails();
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }

    /**
     * Deletes the selected organization.
     */
    deleteOrganization(): void {
        this.organizationService.deleteOrganization(this.organization.organizationId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.organizationStateService.setOrganizationId(null);
                this.organization = null;
                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('Success'),
                    detail: this.translateService.instant('OrganizationManagement.Organization is deleted successfully')
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: this.translateService.instant('Error'),
                    detail: error.message
                });
            }
        });
    }

    /**
     * Handles the event when the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadOrganizationDetails();
    }
}
