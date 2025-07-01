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
    templateUrl: './app.menu.component.html',
    styleUrls: ['./app.menu.component.scss']
})
export class AppMenuComponent extends BaseComponent implements OnInit {
    /**
     * List of navigation buttons.
     */
    model: MenuItem[] = [];

    /**
     * The list of roles for the logged user
     */
    userRoles: Role[] = [];

    constructor(
        private injector: Injector
    ) {
        super(injector);
    }

    ngOnInit() {
        this.roleService.getRolesAsObservable().pipe(takeUntil(this.destroy$))
            .subscribe({
                next: roles => {
                    this.userRoles = roles;
                    this.configureNavigationMenu();
                },
                error: (error: any) => {
                    this.translateService.get('Error').subscribe(translation => {
                        this.messageService.add({
                            severity: 'error',
                            summary: translation,
                            detail: error.message
                        });
                    });
                }
            });

        this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.markActiveItem();
        });
    }

    /**
     * Configure the navigation menu based on the roles of the user.
     */
    configureNavigationMenu() {
        this.model = [];



        this.translateService.get('Study Management').subscribe(translation => {
            this.model.push({
                label: translation,
                icon: 'pi pi-book',
                routerLink: ['/study-management']
            });
        });


        if (this.userRoles != null) {
            if (this.userRoles.includes(Role.DATA_SCIENTIST)) {
                this.translateService.get(['Data Scientist', 'Parameter Management', 'Learning Process Management', 'Model Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['Data Scientist'],
                        icon: 'pi pi-globe',
                        items: [
                            {
                                label: translations['Parameter Management'],
                                icon: 'pi pi-cog',
                                routerLink: ['/parameter-management']
                            },
                            {
                                label: translations['Learning Process Management'],
                                icon: 'pi pi-globe',
                                routerLink: ['/learning-process-management']
                            },
                            {
                                label: translations['Model Management'],
                                icon: 'pi pi-code',
                                routerLink: ['/model-management']
                            }
                        ]
                    });
                });
            }

            if (this.userRoles.includes(Role.ML_ENGINEER)) {
                this.translateService.get(['ML ENGINEER', 'Deployment Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['ML ENGINEER'],
                        icon: 'pi pi-android',
                        items: [
                            {
                                label: translations['Deployment Management'],
                                icon: 'pi pi-cloud-upload',
                                routerLink: ['/deployment-management']
                            }
                        ]
                    });
                });
            }

            if (this.userRoles.includes(Role.SURVEY_MANAGER)) {
                this.translateService.get(['Survey Manager', 'Survey Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['Survey Manager'],
                        icon: 'pi pi-chart-line',
                        items: [
                            {
                                label: translations['Survey Management'],
                                icon: 'pi pi-chart-line',
                                routerLink: ['/survey-management']
                            }
                        ]
                    });
                });
            }

            if (this.userRoles.includes(Role.DATA_ENGINEER)) {
                this.translateService.get(['Data Engineer', 'Feature Management', 'Dataset Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['Data Engineer'],
                        icon: 'pi pi-sliders-h',
                        items: [
                            {
                                label: translations['Feature Management'],
                                icon: 'pi pi-sliders-h',
                                routerLink: ['/featureset-management']
                            },
                            {
                                label: translations['Dataset Management'],
                                icon: 'pi pi-folder-open',
                                routerLink: ['/dataset-management']
                            }
                        ]
                    });
                });
            }

            if (this.userRoles.includes(Role.QUALITY_ASSURANCE_SPECIALIST)) {
                this.translateService.get(['Quality Assurance', 'Passport Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['Quality Assurance'],
                        icon:
                            'pi pi-map',
                        items:
                            [
                                {
                                    label: translations['Passport Management'],
                                    icon: 'pi pi-map',
                                    routerLink: ['/passport-management']
                                }
                            ]
                    });
                })
            }

            if (this.userRoles.includes(Role.ORGANIZATION_ADMIN)) {
                this.translateService.get(['Organization Admin', 'Organization Management']).subscribe(translations => {
                    this.model.push({
                        label: translations['Organization Admin'],
                        icon: 'pi pi-building',
                        items: [
                            {
                                label: translations['Organization Management'],
                                icon: 'pi pi-building',
                                routerLink: ['/organization-management/organization']
                            }
                        ]
                    });
                });
            }
        }

        this.markActiveItem();
    }

    /**
     * Marks the active item or dropdown in the menu based on the current route.
     */
    markActiveItem() {
        const currentRoute = this.router.url;
        this.model.forEach(item => {
            if (item.routerLink && currentRoute.startsWith(item.routerLink[0])) {
                item.expanded = true;
                item['class'] = 'text-primary';
            } else if (item.items) {
                // Check inside dropdown items
                item.items.forEach(subItem => {
                    if (subItem.routerLink && currentRoute.startsWith(subItem.routerLink[0])) {
                        item.expanded = true;
                        subItem['class'] = 'text-primary';
                    } else {
                        subItem['class'] = 'text-500';
                    }
                });
            } else {
                item.expanded = false;
                item['class'] = 'text-500';
            }
        });
    }
}
