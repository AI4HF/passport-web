import { Component, Injector, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../../../shared/models/organization.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';

/**
 * Component for creating or updating an organization.
 */
@Component({
    selector: 'app-organization-form',
    templateUrl: './organization-form.component.html',
    styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent extends BaseComponent implements OnInit, OnChanges {
    /** Determines if the form is displayed */
    @Input() displayForm: boolean;
    /** The ID of the organization to be edited */
    @Input() organizationId: number;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** Form group for organization form controls */
    organizationForm: FormGroup;
    /** The selected organization to be edited */
    selectedOrganization: Organization = new Organization({});

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
    ngOnInit() {
        this.initializeForm();
    }

    /**
     * Responds to changes in input properties.
     */
    ngOnChanges() {
        if (this.displayForm) {
            this.loadOrganization();
        }
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.organizationForm = new FormGroup({
            name: new FormControl(this.selectedOrganization.name, Validators.required),
            address: new FormControl(this.selectedOrganization.address, Validators.required)
        });
    }

    /**
     * Loads the organization details if an organization ID is provided.
     */
    loadOrganization() {
        if (this.organizationId) {
            this.organizationService.getOrganizationById(this.organizationId).pipe(takeUntil(this.destroy$)).subscribe({
                next: (organization) => {
                    this.selectedOrganization = organization;
                    this.updateForm();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        } else {
            this.selectedOrganization = new Organization({ name: '', address: '' });
            this.initializeForm();
        }
    }

    /**
     * Updates the form with the loaded organization details.
     */
    updateForm() {
        this.organizationForm.patchValue({
            name: this.selectedOrganization.name,
            address: this.selectedOrganization.address
        });
    }

    /**
     * Saves the organization details.
     */
    saveOrganization() {
        if (this.organizationId) {
            const updatedOrganization = new Organization({ organizationId: this.selectedOrganization.id, ...this.organizationForm.value });
            this.organizationService.updateOrganization(updatedOrganization).pipe(takeUntil(this.destroy$)).subscribe({
                next: organization => {
                    this.selectedOrganization = organization;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('OrganizationManagement.Organization is updated successfully')
                    });
                    this.closeDialog(true);
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });
        } else {
            this.organizationService.createOrganization(new Organization({ ...this.organizationForm.value })).pipe(takeUntil(this.destroy$)).subscribe({
                next: organization => {
                    this.selectedOrganization = organization;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('OrganizationManagement.Organization is created successfully')
                    });
                    this.closeDialog(true);
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
    }

    /**
     * Closes the dialog and optionally refreshes the parent component.
     * @param refresh Indicates whether to refresh the parent component
     */
    closeDialog(refresh: boolean = false) {
        this.displayForm = false;
        this.formClosed.emit();
        if (refresh) {
            this.router.navigate(['/organization-management/organization/table']);
        }
    }
}

