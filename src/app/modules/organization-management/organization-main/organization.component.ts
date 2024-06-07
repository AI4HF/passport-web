import { Component, OnInit } from '@angular/core';
import { OrganizationManagementService } from '../../../core/services/organization-management.service';
import { Organization } from '../../../shared/models/organization.model';
import { OrganizationManagementComponent } from '../organization-management.component';

@Component({
    selector: 'app-organization',
    templateUrl: './organization.component.html',
    styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {
    /**
     * Variables to hold the current and new organization bodies.
     */
    organization: Organization = null;
    newOrganization: Organization = { name: '', address: '' };
    /**
     * Some form control flags.
     */
    isEditing = { name: false, address: false };
    displayDialog: boolean = false;
    /**
     * Token from the local storage.
     */
    token: string = '';

    constructor(
        private orgService: OrganizationManagementService,
        private orgManagementComponent: OrganizationManagementComponent
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        this.loadOrganizationDetails();
    }

    /**
     * Current organization loading mechanism with a mock logic.
     */
    loadOrganizationDetails(): void {
        this.orgService.getAllOrganizations(0, this.token).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    const org = response.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
                    this.organization = { name: org.name, address: org.address };
                    this.orgManagementComponent.setOrganizationId(org.id);
                    localStorage.setItem('currentOrganizationId', org.id.toString());
                } else {
                    this.organization = null;
                    this.orgManagementComponent.setOrganizationId(null);
                    localStorage.removeItem('currentOrganizationId');
                }
            },
            (error) => {
                console.error('Error loading organization details', error);
            }
        );
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

    /**
     * Update functionality with either name or address fields. Not both.
     * @param field The chosen field name.
     */
    updateOrganizationField(field: string): void {
        this.newOrganization = { ...this.organization };

        if (field === 'name') {
            this.newOrganization.name = this.organization.name;
        } else if (field === 'address') {
            this.newOrganization.address = this.organization.address;
        }

        this.saveOrganization();
    }

    /**
     * Update form control tool.
     */
    showCreateUpdateDialog(): void {
        this.newOrganization = this.organization ? { ...this.organization } : { name: '', address: '' };
        this.displayDialog = true;
    }

    saveOrganization(): void {
        if (this.organization) {
            this.orgService.updateOrganization(this.orgManagementComponent.getOrganizationId(), this.newOrganization, this.token).subscribe(
                (updatedOrg) => {
                    this.organization = { ...updatedOrg };
                    this.loadOrganizationDetails();
                    this.displayDialog = false;
                },
                (error) => {
                    console.error('Error updating organization', error);
                }
            );
        } else {
            this.orgService.createOrganization(this.newOrganization, this.token).subscribe(
                (createdOrg) => {
                    this.organization = { ...createdOrg };
                    this.loadOrganizationDetails();
                    this.displayDialog = false;
                },
                (error) => {
                    console.error('Error creating organization', error);
                }
            );
        }
    }

    deleteOrganization(): void {
        const organizationId = this.orgManagementComponent.getOrganizationId();
        if (organizationId) {
            this.orgService.deleteOrganization(organizationId, this.token).subscribe(
                () => {
                    this.loadOrganizationDetails();
                },
                (error) => {
                    console.error('Error deleting organization', error);
                }
            );
        }
    }
}




