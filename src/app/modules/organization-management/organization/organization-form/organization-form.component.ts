import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization } from '../../../../shared/models/organization.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';

@Component({
    selector: 'app-organization-form',
    templateUrl: './organization-form.component.html',
    styleUrls: ['./organization-form.component.scss']
})
export class OrganizationFormComponent extends BaseComponent implements OnInit {
    organizationForm: FormGroup;
    selectedOrganization: Organization = new Organization({ name: '', address: '' });
    displayDialog: boolean = true;

    constructor(
        protected injector: Injector,
    ) {
        super(injector);
    }

    ngOnInit() {
        this.initializeForm();
        this.route.params.subscribe(params => {
            const id = params['id'];
            if (id) {
                this.organizationService.getOrganizationById(id).pipe(takeUntil(this.destroy$)).subscribe({
                    next: (organization) => {
                        this.selectedOrganization = organization;
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
        this.organizationForm = new FormGroup({
            name: new FormControl(this.selectedOrganization.name, Validators.required),
            address: new FormControl(this.selectedOrganization.address, Validators.required)
        });
    }

    updateForm() {
        this.organizationForm.patchValue({
            name: this.selectedOrganization.name,
            address: this.selectedOrganization.address
        });
    }

    saveOrganization() {
        if (this.organizationForm.valid) {
            if (this.selectedOrganization.id) {
                const updatedOrganization = { ...this.selectedOrganization, ...this.organizationForm.value };
                this.organizationService.updateOrganization(updatedOrganization).pipe(takeUntil(this.destroy$)).subscribe({
                    next: organization => {
                        this.selectedOrganization = organization;
                        this.closeDialog();
                    },
                    error: (error) => {
                        console.log(error);
                    }
                });
            } else {
                this.organizationService.createOrganization(<Organization>this.organizationForm.value).pipe(takeUntil(this.destroy$)).subscribe({
                    next: organization => {
                        this.selectedOrganization = organization;
                        this.closeDialog();
                    },
                    error: (error) => {
                        console.log(error);
                    }
                });
            }
        }
    }

    closeDialog() {
        this.displayDialog = false;
        this.router.navigate(['/organization-management/organization/table']);
    }
}
