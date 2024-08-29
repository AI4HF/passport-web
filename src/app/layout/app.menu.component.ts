import { Injector, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { BaseComponent } from "../shared/components/base.component";
import { MenuItem } from 'primeng/api';
import { Role } from "../shared/models/role.enum";
import { takeUntil } from "rxjs/operators";

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

    /**
     * The role of logged user
     */
    userRole: Role;

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.roleService.getRoleAsObservable().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: role => {
                    this.userRole = role;
                    this.configureNavigationMenu();
                },
                error: (error: any) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translateService.instant('Error'),
                        detail: error.message
                    });
                }
            });

        this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.markActiveItem();
        });
    }

    /**
     * Configure navigation menu according to the role of user.
     */
    configureNavigationMenu() {
        this.model = [];
        switch (this.userRole) {
            case Role.STUDY_OWNER:
                this.model.push({
                    label: this.translateService.instant('Study Management'),
                    icon: 'pi pi-book',
                    routerLink: ['/study-management']
                });
                break;
            case Role.DATA_SCIENTIST:
                this.model.push({
                    label: this.translateService.instant('Parameter Management'),
                    icon: 'pi pi-cog',
                    routerLink: ['/parameter-management']
                });
                this.model.push({
                    label: this.translateService.instant('Learning Process Management'),
                    icon: 'pi pi-globe',
                    routerLink: ['/learning-process-management']
                });
                this.model.push({
                    label: this.translateService.instant('Model Management'),
                    icon: 'pi pi-code',
                    routerLink: ['/model-management']
                });
                this.model.push({
                    label: this.translateService.instant('Deployment Management'),
                    icon: 'pi pi-cloud-upload',
                    routerLink: ['/deployment-management']
                });
                break;
            case Role.SURVEY_MANAGER:
                this.model.push({
                    label: this.translateService.instant('Survey Management'),
                    icon: 'pi pi-chart-line',
                    routerLink: ['/survey-management']
                });
                break;
            case Role.DATA_ENGINEER:
                this.model.push({
                    label: this.translateService.instant('Feature Management'),
                    icon: 'pi pi-sliders-h',
                    routerLink: ['/featureset-management']
                });
                this.model.push({
                    label: this.translateService.instant('Dataset Management'),
                    icon: 'pi pi-folder-open',
                    routerLink: ['/dataset-management']
                });
                break;
            case Role.ML_ENGINEER:
                //TODO:
                this.model.push({});
                break;
            case Role.QUALITY_ASSURANCE_SPECIALIST:
                this.model.push({
                    label: this.translateService.instant('Passport Management'),
                    icon: 'pi pi-map',
                    routerLink: ['/passport-management']
                });
                break;
            case Role.ORGANIZATION_ADMIN:
                this.model.push({
                    label: this.translateService.instant('Organization Management'),
                    icon: 'pi pi-building',
                    routerLink: ['/organization-management/organization']
                });
                break;
        }
        this.markActiveItem();
    }

    /**
     * Marks the active item in the menu based on the current route.
     */
    markActiveItem() {
        const currentRoute = this.router.url;
        this.model.forEach(item => {
            item.expanded = item.routerLink && currentRoute.startsWith(item.routerLink[0]);
        });
    }
}
