import { Injector, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { BaseComponent } from "../shared/components/base.component";
import { MenuItem } from 'primeng/api';

/**
 * Menu component which handles the navigation header connections.
 */
@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent extends BaseComponent implements OnInit, OnDestroy {
    /**
     * List of navigation buttons.
     */
    model: MenuItem[] = [];
    /**
     * CurrentOrganizationID used to determine if the Personnel tab should be accessible.
     * @private
     */
    private currentOrganizationId: number | null = null;

    constructor(private injector: Injector, private cdr: ChangeDetectorRef) {
        super(injector);
    }

    /**
     * Initializer which also handles the check to see if there is an existing organization ID, and then stores it.
     */
    ngOnInit() {
        this.organizationStateService.organizationId$.subscribe(id => {
            this.currentOrganizationId = id;
            this.updateMenuItems();
            this.cdr.detectChanges();
        });
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
            },
            {
                label: this.translateService.instant('Parameter Management'),
                icon: 'pi pi-cog',
                routerLink: ['/parameter-management']
            },
            {
                label: this.translateService.instant('Model Management'),
                icon: 'pi pi-code',
                routerLink: ['/model-management']
            }
        ];
    }
}
