import { Component, Injector, OnInit } from '@angular/core';
import { Personnel } from '../../../../shared/models/personnel.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../shared/components/base.component";

@Component({
    selector: 'app-personnel-table',
    templateUrl: './personnel-table.component.html',
    styleUrls: ['./personnel-table.component.scss']
})
export class PersonnelTableComponent extends BaseComponent implements OnInit {
    personnelList: Personnel[];
    columns: any[];
    loading: boolean = true;

    constructor(protected injector: Injector) {
        super(injector);
        this.columns = [
            { header: 'First Name', field: 'firstName' },
            { header: 'Last Name', field: 'lastName' },
            { header: 'Role', field: 'role' },
            { header: 'E-Mail', field: 'email' }
        ];
    }

    ngOnInit() {
        this.loadPersonnelList();
    }

    loadPersonnelList() {
        const storedOrgId = localStorage.getItem('organizationId');
        if (storedOrgId) {
            this.personnelService.getPersonnelByOrganizationId(+storedOrgId).pipe(takeUntil(this.destroy$)).subscribe({
                next: personnel => {
                    this.personnelList = personnel;
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
        }
    }

    filter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    createPersonnel() {
        this.router.navigate(['/organization-management/personnel/form/new']);
    }

    editPersonnel(personnel: Personnel) {
        this.router.navigate([`/organization-management/personnel/form/`, personnel.personId]);
    }

    deletePersonnel(personId: number) {
        this.personnelService.deletePersonnel(personId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.personnelList = this.personnelList.filter(p => p.personId !== personId);
                this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('Success'),
                    detail: this.translateService.instant('PersonnelManagement.Personnel.Personnel is deleted successfully')
                });
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
