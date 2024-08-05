import { Injector, OnInit} from '@angular/core';
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
export class AppMenuComponent extends BaseComponent implements OnInit {
    /**
     * List of navigation buttons.
     */
    model: MenuItem[] = [];

    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.model = [
            {
                label: this.translateService.instant('Study Management'),
                icon: 'pi pi-book',
                routerLink: ['/study-management']
            },
            {
                label: this.translateService.instant('Organization Management'),
                icon: 'pi pi-building',
                routerLink: ['/organization-management/organization']
            },
            {
                label: this.translateService.instant('Survey Management'),
                icon: 'pi pi-chart-line',
                routerLink: ['/survey-management']
            },
            {
                label: this.translateService.instant('Data Management'),
                icon: 'pi pi-database',
                items: [
                    {
                        label: this.translateService.instant('Feature Management'),
                        icon: 'pi pi-sliders-h',
                        routerLink: ['/featureset-management']
                    },
                    {
                        label: this.translateService.instant('Dataset Management'),
                        icon: 'pi pi-folder-open',
                        routerLink: ['/dataset-management']
                    }
                ]
            },
            {
                label: this.translateService.instant('Parameter Management'),
                icon: 'pi pi-cog',
                routerLink: ['/parameter-management']
            }
        ];
    }
}
