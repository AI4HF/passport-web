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
    organization: Organization = null;
    newOrganization: Organization = { name: '', address: '' };
    isEditing = { name: false, address: false };
    displayDialog: boolean = false;
    token: string = '';

    constructor(
        private orgService: OrganizationManagementService,
        private orgManagementComponent: OrganizationManagementComponent
    ) {}

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        this.loadOrganizationDetails();
    }

    loadOrganizationDetails(): void {
        this.orgService.getAllOrganizations(0, this.token).subscribe(
            (response) => {
                if (response && response.length > 0) {
                    const org = response.reduce((prev, curr) => (prev.id < curr.id ? prev : curr));
                    this.organization = { name: org.name, address: org.address };
                    this.orgManagementComponent.setOrganizationId(org.id);
                    localStorage.setItem('currentOrganizationId', org.id.toString()); // Store organization ID in local storage
                } else {
                    this.organization = null;
                    this.orgManagementComponent.setOrganizationId(null);
                    localStorage.removeItem('currentOrganizationId'); // Remove organization ID from local storage
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

    updateOrganizationField(field: string): void {
        // Copy existing organization data to newOrganization
        this.newOrganization = { ...this.organization };

        // Update only the edited field
        if (field === 'name') {
            this.newOrganization.name = this.organization.name;
        } else if (field === 'address') {
            this.newOrganization.address = this.organization.address;
        }

        // Save the updated organization
        this.saveOrganization();
    }

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




