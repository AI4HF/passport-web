import {Component, DoCheck, Injector, OnInit} from '@angular/core';
import {StorageUtil} from "../core/services/storageUtil.service";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../shared/components/base.component";
import {ROLES} from "../shared/models/roles.constant";

@Component({
    selector: 'app-profile',
    templateUrl: './app.profile.component.html',
    styleUrls: ['./app.profile.component.scss']
})
export class AppProfileComponent extends BaseComponent implements DoCheck, OnInit{
    /**
     * Menu items displayed under user name
     */
    menu = [
        //   {value: 'profile', label: 'Profile', icon: 'pi pi-user'},
        //   {value: 'settings', label: 'Settings', icon: 'pi pi-cog'},
        {value: 'logout', label: 'Logout', icon: 'pi pi-power-off'}
    ]

    /** The name of logged personnel */
    personnelName: string;
    /** The surname of logged personnel */
    personnelSurname: string;
    /** The organization name of logged personnel */
    organizationName: string;

    /** The role of logged personnel */
    personnelRole: string;

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngDoCheck() {
        if(StorageUtil.retrievePersonnelName()){
            this.personnelName = StorageUtil.retrievePersonnelName();
        }
        if(StorageUtil.retrievePersonnelSurname()){
            this.personnelSurname = StorageUtil.retrievePersonnelSurname();
        }
        if(StorageUtil.retrieveOrganizationName()){
            this.organizationName = StorageUtil.retrieveOrganizationName();
        }
    }

    /**
     * Fired when user selects a menu item
     * @param event
     */
    onMenuItemSelect(event: any) {
        switch (event.option.value) {
            case 'logout':
                this.logout();
                break;
            default:
                return;
        }
    }

    /**
     * Redirects user to the login page
     */
    login() {
        this.router.navigate(['./login'])
    }

    /**
     * Clears any session data and returns to the main page
     */
    logout() {
        StorageUtil.removeToken();
        StorageUtil.removeUserId();
        StorageUtil.removePersonnelName();
        StorageUtil.removeOrganizationName();
        StorageUtil.removeOrganizationId();
        StorageUtil.removePersonnelSurname();
        this.router.navigate(['../login'])
    }

    ngOnInit(): void {
        this.roleService.getRoleAsObservable().pipe(takeUntil(this.destroy$))
            .subscribe({next: role => {
                if(role){
                    const roleString = ROLES.find((roles) => role.toString() === roles.value);
                    this.personnelRole = roleString.name;
                }
                }});
    }
}
