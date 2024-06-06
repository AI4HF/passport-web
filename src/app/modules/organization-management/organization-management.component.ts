import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-organization-management',
    templateUrl: './organization-management.component.html',
    styleUrls: ['./organization-management.component.scss']
})
export class OrganizationManagementComponent implements OnInit {
    currentOrganizationId: number = null;

    constructor() {}

    ngOnInit(): void {}

    setOrganizationId(id: number): void {
        this.currentOrganizationId = id;
    }

    getOrganizationId(): number {
        return this.currentOrganizationId;
    }
}
