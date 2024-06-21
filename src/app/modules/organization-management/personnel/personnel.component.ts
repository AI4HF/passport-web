import { Component, OnInit } from '@angular/core';
import { Personnel } from '../../../shared/models/personnel.model';
import { PersonnelService } from '../../../core/services/personnel.service';

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
    selectedPersonnel: Personnel = new Personnel({ firstName: '', lastName: '', role: '', email: '' });
    totalRecords: number = 0;
    pageSize: number = 10;

    constructor(private personnelService: PersonnelService) {}

    ngOnInit(): void {
        this.loadPersonnelList();
    }

    loadPersonnelList(): void {
        const storedOrgId = localStorage.getItem('organizationId');
        if (storedOrgId) {
            this.personnelService.getPersonnelList(<number><unknown>storedOrgId).subscribe({
                next: (personnel) => {
                    this.personnelList = personnel;
                    this.totalRecords = personnel.length;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    deletePersonnel(personnel: Personnel): void {
        if (personnel && personnel.personId) {
            this.personnelService.deletePersonnel(personnel.personId).subscribe({
                next: () => {
                    this.personnelList = this.personnelList.filter(p => p.personId !== personnel.personId);
                    this.totalRecords = this.personnelList.length;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    showCreateForm(): void {
        this.selectedPersonnel = new Personnel({ firstName: '', lastName: '', role: '', email: '' });
        this.displayDialog = true;
    }

    editPersonnel(personnel: Personnel): void {
        this.selectedPersonnel = { ...personnel };
        this.displayDialog = true;
    }

    savePersonnel(): void {
        if (this.selectedPersonnel.personId) {
            this.personnelService.updatePersonnel(this.selectedPersonnel).subscribe({
                next: (updatedPersonnel) => {
                    const index = this.personnelList.findIndex(p => p.personId === this.selectedPersonnel.personId);
                    if (index !== -1) {
                        this.personnelList[index] = updatedPersonnel;
                    }
                    this.displayDialog = false;
                    this.totalRecords = this.personnelList.length;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        } else {
            this.selectedPersonnel.organizationId = <number><unknown>localStorage.getItem('organizationId');
            this.personnelService.createPersonnel(this.selectedPersonnel).subscribe({
                next: (createdPersonnel) => {
                    this.personnelList.push(createdPersonnel);
                    this.displayDialog = false;
                    this.totalRecords = this.personnelList.length;
                },
                error: (error) => {
                    console.log(error);
                }
            });
        }
    }

    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}

