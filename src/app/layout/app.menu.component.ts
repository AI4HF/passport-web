import {Injector, OnInit} from '@angular/core';
import { Component } from '@angular/core';
import {BaseComponent} from "../shared/components/base.component";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent extends BaseComponent implements OnInit {

    model: any[] = [];

    constructor(private injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        this.model = [
            {
                label: this.translateService.instant('Manage Studies'),
                icon: 'pi pi-book',
                routerLink: ['/study-management']
            },
            {
                label: this.translateService.instant('Organization'),
                icon: 'pi pi-home',
                routerLink: ['/']
            }
        ];
    }
}
