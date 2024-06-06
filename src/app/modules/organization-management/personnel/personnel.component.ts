import { Component, OnInit } from '@angular/core';
import { Personnel } from '../../../shared/models/personnel.model';
import { OrganizationManagementService } from '../../../core/services/organization-management.service';
import {TableLazyLoadEvent} from "primeng/table";

@Component({
    selector: 'app-personnel',
    templateUrl: './personnel.component.html',
    styleUrls: ['./personnel.component.scss']
})
export class PersonnelComponent implements OnInit {
    personnelList: Personnel[] = [];
    columns: any[] = [
        { header: 'First Name', field: 'firstName' },
        { header: 'Last Name', field: 'lastName' },
        { header: 'Role', field: 'role' },
        { header: 'E-Mail', field: 'email' }
    ];
    loading: boolean = false;
    displayDialog: boolean = false;
    selectedPersonnel: Personnel = { firstName: '', lastName: '', role: '', email: '' };
    token: string = '';
    organizationId: number = null;
    totalRecords: number = 0;
    currentPage: number = 0;
    pageSize: number = 10; // Default page size

    constructor(private orgService: OrganizationManagementService) {}

    ngOnInit(): void {
        this.token = localStorage.getItem('token');
        this.organizationId = parseInt(localStorage.getItem('currentOrganizationId'), 10); // Retrieve organization ID from local storage
    }

    loadPersonnelList(event: TableLazyLoadEvent): void {
        this.loading = true;
        const page = event.first !== undefined && event.rows !== undefined ? event.first / event.rows : this.currentPage;
        this.pageSize = event.rows || this.pageSize;
        this.currentPage = page;

        this.orgService.getAllPersonnelOfOrganization(this.organizationId, this.currentPage, this.pageSize, this.token).subscribe(
            (response) => {
                this.personnelList = response.personnel;
                this.totalRecords = response.totalCount;
                this.loading = false;
            },
            (error) => {
                console.error('Error loading personnel list', error);
                this.loading = false;
            }
        );
    }

    deletePersonnel(personnel: Personnel): void {
        if (personnel && personnel.id) {
            this.orgService.deletePersonnel(personnel.id, this.token).subscribe(
                () => {
                    this.loadPersonnelList({first: this.currentPage * this.pageSize, rows: this.pageSize});
                },
                (error) => {
                    console.error('Error deleting personnel', error);
                }
            );
        }
    }

    showCreateForm(): void {
        this.selectedPersonnel = { firstName: '', lastName: '', role: '', email: '' };
        this.displayDialog = true;
    }

    editPersonnel(personnel: Personnel): void {
        this.selectedPersonnel = { ...personnel };
        this.displayDialog = true;
    }

    savePersonnel(): void {
        if (this.selectedPersonnel.id) {
            this.orgService.updatePersonnel(this.selectedPersonnel.id, this.selectedPersonnel, this.token).subscribe(
                () => {
                    this.loadPersonnelList({first: this.currentPage * this.pageSize, rows: this.pageSize});
                    this.displayDialog = false;
                },
                (error) => {
                    console.error('Error updating personnel', error);
                }
            );
        } else {
            const organizationId = this.organizationId;
            if (organizationId) {
                const newPersonnel = { ...this.selectedPersonnel, organization: { id: organizationId } };
                this.orgService.createPersonnel(newPersonnel, this.token).subscribe(
                    () => {
                        this.loadPersonnelList({first: this.currentPage * this.pageSize, rows: this.pageSize});
                        this.displayDialog = false;
                    },
                    (error) => {
                        console.error('Error creating personnel', error);
                    }
                );
            }
        }
    }

    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}




