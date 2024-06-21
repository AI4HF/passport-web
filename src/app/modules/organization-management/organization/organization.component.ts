import {Component, OnInit} from '@angular/core';
import {Organization} from '../../../shared/models/organization.model';
import {OrganizationService} from '../../../core/services/organization.service';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
    organization: Organization = null;
    newOrganization: Organization = new Organization({name: '', address: ''});
    isEditing = {name: false, address: false};
    displayDialog: boolean = false;
    token: string = '';

    constructor(private organizationService: OrganizationService) {
    }

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        this.loadOrganizationDetails();
    }

    loadOrganizationDetails(): void {
        const storedOrgId = localStorage.getItem('organizationId');
        if (storedOrgId) {
            this.organizationService.getOrganizationById(+storedOrgId).subscribe({
                next: (org) => {
                    this.organization = org;
                },
                error: () => {
                    this.organization = null;
                }
            });
        } else {
            this.organizationService.getAllOrganizations().subscribe({
                next: (orgs) => {
                    if (orgs.length > 0) {
                        this.organization = orgs[0];
                        localStorage.setItem('organizationId', String(this.organization.id));
                    } else {
                        this.organization = null;
                    }
                },
                error: () => {
                    this.organization = null;
                }
            });
        }
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
        this.newOrganization = {...this.organization};

        if (field === 'name') {
            this.newOrganization.name = this.organization.name;
        } else if (field === 'address') {
            this.newOrganization.address = this.organization.address;
        }

        this.saveOrganization();
    }

    showCreateUpdateDialog(): void {
        this.newOrganization = this.organization ? {...this.organization} : new Organization({name: '', address: ''});
        this.displayDialog = true;
    }

    saveOrganization(): void {
        if (this.organization) {
            this.newOrganization.id = <number><unknown>localStorage.getItem('organizationId');
            this.organizationService.updateOrganization(this.newOrganization).subscribe({
                next: (updatedOrg) => {
                    this.organization = updatedOrg;
                    this.displayDialog = false;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        } else {
            this.organizationService.createOrganization(this.newOrganization).subscribe({
                next: (createdOrg) => {
                    this.organization = createdOrg;
                    this.displayDialog = false;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    deleteOrganization(): void {
        this.organizationService.deleteOrganization(<number><unknown>localStorage.getItem('organizationId')).subscribe({
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






