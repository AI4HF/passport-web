import { Injector, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { BaseComponent } from "../shared/components/base.component";
import { MenuItem } from 'primeng/api';

/**
 * Menu component which handles the items on the header
 */
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent extends BaseComponent implements OnInit, OnDestroy {

    model: MenuItem[] = [];
    private currentOrganizationId: string | null = null;

    constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    ngOnInit() {
        this.currentOrganizationId = localStorage.getItem('organizationId');
        this.updateMenuItems();

        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    /**
     * Method which checks if there is a current organization and makes the personnel tab appear or not appear.
     */
    private handleStorageChange(event: StorageEvent) {
        if (event.key === 'organizationId') {
            this.currentOrganizationId = event.newValue;
            this.updateMenuItems();
            this.cdr.detectChanges();
        }
    }

    /**
     * Place to add new connections, now ensuring that if a current organization is not available, its personnel are not shown.
     */
    private updateMenuItems() {
        this.model = [
            {
                label: this.translateService.instant('Manage Studies'),
                icon: 'pi pi-book',
                routerLink: ['/study-management']
            },
            {
                label: this.translateService.instant('Organization'),
                icon: 'pi pi-home',
                items: [
                    {
                        label: this.translateService.instant('Organization'),
                        icon: 'pi pi-building',
                        routerLink: ['/organization-management/organization']
                    },
                    ...(this.currentOrganizationId ? [{
                        label: this.translateService.instant('Personnel'),
                        icon: 'pi pi-users',
                        routerLink: ['/organization-management/personnel']
                    }] : [])
                ]
            },
            {
                label: this.translateService.instant('Survey Management'),
                icon: 'pi pi-chart-line',
                routerLink: ['/survey-management']
            }
        ];
    }
}
