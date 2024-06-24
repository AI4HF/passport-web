import { Component, Injector, OnInit } from '@angular/core';
import { Organization } from '../../../../shared/models/organization.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from '../../../../shared/components/base.component';

@Component({
    selector: 'app-organization-table',
    templateUrl: './organization-table.component.html',
    styleUrls: ['./organization-table.component.scss']
})
export class OrganizationTableComponent extends BaseComponent implements OnInit {
    organization: Organization = null;
    isEditing = { name: false, address: false };
    token: string = '';

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        this.loadOrganizationDetails();
    }

    loadOrganizationDetails(): void {
        this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
                next: (orgs) => {
                    if (orgs.length > 0) {
                        this.organization = orgs[0];
                        console.log(orgs[0].id);
                        localStorage.setItem('organizationId', String(orgs[0].id));
                    } else {
                        this.organization = null;
                    }
                },
                error: () => {
                    this.organization = null;
                }
            });

    }

    toggleName(): void {
        this.isEditing.name = !this.isEditing.name;
        if (!this.isEditing.name) {
            this.updateOrganizationField('name');
        }
    }

    toggleAddress(): void {
        this.isEditing.address = !this.isEditing.address;
        if (!this.isEditing.address) {
            this.updateOrganizationField('address');
        }
    }

    updateOrganizationField(field: string): void {
        const updatedOrganization = { ...this.organization };

        if (field === 'name') {
            updatedOrganization.name = this.organization.name;
        } else if (field === 'address') {
            updatedOrganization.address = this.organization.address;
        }

        this.saveOrganization(updatedOrganization);
    }

    showCreateUpdateDialog(): void {
        if (this.organization) {
            this.router.navigate(['/organization-management/organization/form/', this.organization.id]);
        } else {
            this.router.navigate(['/organization-management/organization/form/new']);
        }
    }

    saveOrganization(organization: Organization): void {
        this.organizationService.updateOrganization(organization).pipe(takeUntil(this.destroy$)).subscribe({
            next: (updatedOrg) => {
                this.organization = updatedOrg;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }

    deleteOrganization(): void {
        this.organizationService.deleteOrganization(<number><unknown>localStorage.getItem('organizationId')).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                localStorage.removeItem('organizationId');
                this.organization = null;
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}


