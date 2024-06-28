import { Component, Injector, Input, OnInit, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Personnel } from '../../../../shared/models/personnel.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../shared/components/base.component";
import { Role } from "../../../../shared/models/role.enum";

/**
 * Component for creating or updating personnel.
 */
@Component({
    selector: 'app-personnel-form',
    templateUrl: './personnel-form.component.html',
    styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent extends BaseComponent implements OnInit, OnChanges {
    /** Determines if the form is displayed */
    @Input() displayForm: boolean;
    /** The ID of the personnel to be edited */
    @Input() personnelId: number;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The selected personnel to be edited */
    selectedPersonnel: Personnel = new Personnel({ firstName: '', lastName: '', role: '', email: '' });
    /** Form group for personnel form controls */
    personnelForm: FormGroup;
    roles: any[] = Object.keys(Role).map(key => Role[key as keyof typeof Role]);

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(
        protected injector: Injector,
    ) {
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
            this.loadPersonnel();
        }
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.personnelForm = new FormGroup({
            firstName: new FormControl(this.selectedPersonnel.firstName, Validators.required),
            lastName: new FormControl(this.selectedPersonnel.lastName, Validators.required),
            role: new FormControl(this.selectedPersonnel.role, Validators.required),
            email: new FormControl(this.selectedPersonnel.email, [Validators.required, Validators.email])
        });
    }

    /**
     * Loads the personnel details if a personnel ID is provided.
     */
    loadPersonnel() {
        if (this.personnelId) {
            this.personnelService.getPersonnelByPersonId(this.personnelId).pipe(takeUntil(this.destroy$)).subscribe({
                next: (personnel) => {
                    this.selectedPersonnel = personnel;
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
            this.selectedPersonnel = new Personnel({ firstName: '', lastName: '', role: '', email: '' });
            this.initializeForm();
        }
    }

    /**
     * Updates the form with the loaded personnel details.
     */
    updateForm() {
        this.personnelForm.patchValue({
            firstName: this.selectedPersonnel.firstName,
            lastName: this.selectedPersonnel.lastName,
            role: this.selectedPersonnel.role,
            email: this.selectedPersonnel.email
        });
    }

    /**
     * Saves the personnel details.
     */
    savePersonnel() {
        if (this.personnelId) {
            const organizationId = this.organizationStateService.getOrganizationId();
            const updatedPersonnel = new Personnel({ personId: this.selectedPersonnel.personId, ...this.personnelForm.value, organizationId: organizationId });
            this.personnelService.updatePersonnel(updatedPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('OrganizationManagement.Personnel is updated successfully')
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
            const organizationId = this.organizationStateService.getOrganizationId();
            if (organizationId === null) {
                this.messageService.add({
                    severity: 'warn',
                    summary: this.translateService.instant('Warning'),
                    detail: this.translateService.instant('No organization selected.')
                });
                return;
            }
            const newPersonnel = new Personnel({ ...this.personnelForm.value, organizationId: organizationId });
            this.personnelService.createPersonnelByPersonId(newPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translateService.instant('Success'),
                        detail: this.translateService.instant('OrganizationManagement.Personnel is created successfully')
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
            this.router.navigate(['/organization-management/personnel/table']);
        }
    }
}


