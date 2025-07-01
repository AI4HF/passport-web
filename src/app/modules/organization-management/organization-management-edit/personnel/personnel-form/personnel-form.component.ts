import { Component, Injector, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Personnel } from '../../../../../shared/models/personnel.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { ROLES } from "../../../../../shared/models/roles.constant";
import { NameAndValueInterface } from "../../../../../shared/models/nameAndValue.interface";
import {PersonnelDTO} from "../../../../../shared/models/personnelDTO.model";
import {Credentials} from "../../../../../shared/models/credentials.model";

/**
 * Component for creating or updating personnel.
 */
@Component({
    selector: 'app-personnel-form',
    templateUrl: './personnel-form.component.html',
    styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent extends BaseComponent implements OnInit {
    /** The ID of the personnel to be edited */
    @Input() personnelId: string;
    /** The ID of the organization */
    @Input() organizationId: string;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** Connector-secret support*/
    displayConnectorSecret = false;
    pendingUsername!: string;
    pendingPassword!: string;

    /** The selected personnel to be edited */
    selectedPersonnel: Personnel = new Personnel({});
    /** Form group for personnel form controls */
    personnelForm: FormGroup;

    /** Flag indicating that dialog is visible */
    display = false;
    roles: NameAndValueInterface[] = ROLES;

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
        if (this.personnelId) {
            this.loadPersonnel();
        }
        this.display = true;
    }

    /**
     * Initializes the form group.
     */
    initializeForm() {
        this.personnelForm = new FormGroup({
            firstName: new FormControl(this.selectedPersonnel.firstName, Validators.required),
            lastName: new FormControl(this.selectedPersonnel.lastName, Validators.required),
            email: new FormControl(this.selectedPersonnel.email, [Validators.required, Validators.email])
        });

        if (!this.personnelId) {
            this.personnelForm.addControl('username', new FormControl('', [Validators.required]));
            this.personnelForm.addControl('password', new FormControl('', [Validators.required]));
            this.personnelForm.addControl('role', new FormControl(false, [Validators.required]))
        }
    }

    /**
     * Loads the personnel details if a personnel ID is provided.
     */
    loadPersonnel() {
        this.personnelService.getPersonnelByPersonId(this.personnelId).pipe(takeUntil(this.destroy$)).subscribe({
            next: (personnel) => {
                this.selectedPersonnel = personnel;
                this.updateForm();
            },
            error: (error) => {
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            }
        });
    }

    /**
     * Updates the form with the loaded personnel details.
     */
    updateForm() {
        this.personnelForm.patchValue({
            firstName: this.selectedPersonnel.firstName,
            lastName: this.selectedPersonnel.lastName,
            email: this.selectedPersonnel.email
        });
    }

    /**
     * Saves the personnel details.
     */
    savePersonnel() {
        const formValue = this.personnelForm.value;
        if (!this.selectedPersonnel.personId) {
            const credentials = new Credentials(this.personnelForm.value);
            const newPersonnel = new Personnel({ ...formValue, organizationId: this.organizationId });
            const personnelDTO = new PersonnelDTO({ personnel: newPersonnel, credentials: credentials, isStudyOwner: formValue.role });
            this.personnelService.createPersonnelByPersonId(personnelDTO).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.translateService.get(['Success', 'OrganizationManagement.Personnel is created successfully']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['OrganizationManagement.Personnel is created successfully']
                        });
                    });
                    this.pendingUsername = formValue.username;
                    this.pendingPassword = formValue.password;
                    this.displayConnectorSecret = true;
                },
                error: (error) => {
                    if (error?.status === 400) {
                        this.translateService
                            .get(['Error', 'OrganizationManagement.This username is already in use'])
                            .subscribe(t =>
                                this.messageService.add({
                                    severity: 'error',
                                    summary: t['Error'],
                                    detail:  t['OrganizationManagement.This username is already in use']
                                })
                            );
                        return;
                    }
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });
        } else {
            const updatedPersonnel = new Personnel({ personId: this.selectedPersonnel.personId, ...formValue, organizationId: this.organizationId });
            this.personnelService.updatePersonnel(updatedPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.translateService.get(['Success', 'OrganizationManagement.Personnel is updated successfully']).subscribe(translations => {
                        this.messageService.add({
                            severity: 'success',
                            summary: translations['Success'],
                            detail: translations['OrganizationManagement.Personnel is updated successfully']
                        });
                    });
                },
                error: (error) => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                },
                complete: () => {
                    this.closeDialog();
                }
            });
        }
    }

    /**
     * Closes the dialog and optionally refreshes the parent component.
     */
    closeDialog() {
        this.display = false
        this.formClosed.emit();
    }

    /**
     * Closes connector popup
     */
    onConnectorDialogClosed(): void {
        this.closeDialog();
    }
}