import { Component, Injector, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../../../shared/models/organization.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';
import { ChangeDetectorRef } from '@angular/core';

/**
 * Component for creating or updating an organization.
 */
@Component({
    selector: 'app-organization-form',
    templateUrl: './organization-form.component.html',
    styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent extends BaseComponent implements OnInit {
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** Form group for organization form controls */
    organizationForm: FormGroup;
    /** The selected organization to be edited */
    selectedOrganization: Organization = new Organization({});
    /** Determines if the form is displayed */
    displayForm: boolean = false;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     * @param cdr Change detector reference
     */
    constructor(protected injector: Injector, private cdr: ChangeDetectorRef) {
        super(injector);
        this.initializeForm();
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadOrganization();
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
        const organizationId = this.organizationStateService.getOrganizationId();
        if (organizationId) {
            this.organizationService.getOrganizationById(organizationId).pipe(takeUntil(this.destroy$)).subscribe({
                next: (organization) => {
                    this.selectedOrganization = organization;
                    this.initializeForm();
                    this.displayForm = true;
                    this.cdr.detectChanges(); // Mark changes to avoid ExpressionChangedAfterItHasBeenCheckedError
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
            this.displayForm = true;
            this.cdr.detectChanges(); // Mark changes to avoid ExpressionChangedAfterItHasBeenCheckedError
        }
    }

    /**
     * Saves the organization details.
     */
    saveOrganization() {
        const organizationId = this.organizationStateService.getOrganizationId();
        if (organizationId) {
            const updatedOrganization = new Organization({ organizationId: organizationId, ...this.organizationForm.value });
            this.organizationService.updateOrganization(updatedOrganization).pipe(takeUntil(this.destroy$)).subscribe({
                next: organization => {
                    this.selectedOrganization = organization;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('OrganizationManagement.Organization is updated successfully')
                    });
                    this.closeDialog();
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
                    this.closeDialog();
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
     * Closes the dialog.
     */
    closeDialog() {
        this.displayForm = false;
        this.formClosed.emit();
    }
}
