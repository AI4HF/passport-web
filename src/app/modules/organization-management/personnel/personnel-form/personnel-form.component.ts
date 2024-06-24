import {Component, Injector, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Personnel} from '../../../../shared/models/personnel.model';
import {takeUntil} from 'rxjs/operators';
import {BaseComponent} from "../../../../shared/components/base.component";

@Component({
    selector: 'app-personnel-form',
    templateUrl: './personnel-form.component.html',
    styleUrls: ['./personnel-form.component.scss']
})
export class PersonnelFormComponent extends BaseComponent implements OnInit {
    displayDialog: boolean = true;
    selectedPersonnel: Personnel = new Personnel({firstName: '', lastName: '', role: '', email: ''});
    personnelForm: FormGroup;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.initializeForm();
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.personnelService.getPersonnelById(id).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (personnel) => {
                        this.selectedPersonnel = personnel;
                        this.updateForm();
                    },
                    error: (error) => {
                        console.log(error);
                    }
                });
            }
        });
    }

    initializeForm() {
        this.personnelForm = new FormGroup({
            firstName: new FormControl(this.selectedPersonnel.firstName, Validators.required),
            lastName: new FormControl(this.selectedPersonnel.lastName, Validators.required),
            role: new FormControl(this.selectedPersonnel.role, Validators.required),
            email: new FormControl(this.selectedPersonnel.email, [Validators.required, Validators.email])
        });
    }

    updateForm() {
        this.personnelForm.patchValue({
            firstName: this.selectedPersonnel.firstName,
            lastName: this.selectedPersonnel.lastName,
            role: this.selectedPersonnel.role,
            email: this.selectedPersonnel.email
        });
    }

    savePersonnel() {
        if (this.selectedPersonnel.personId) {
            const updatedPersonnel = {...this.selectedPersonnel, ...this.personnelForm.value};
            this.personnelService.updatePersonnel(updatedPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.closeDialog();
                },
                error: (error) => {
                    console.log(error);
                }
            });
        } else {
            const organizationId = localStorage.getItem('organizationId');
            const newPersonnelData = this.personnelForm.value;
            console.log(newPersonnelData);
            const newPersonnel = {...this.personnelForm.value, organizationId: <number><unknown>organizationId};
            this.personnelService.createPersonnel(newPersonnel).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.selectedPersonnel = personnel;
                    this.closeDialog();
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    closeDialog() {
        this.displayDialog = false;
        this.router.navigate(['/organization-management/personnel/table']);
    }
}
