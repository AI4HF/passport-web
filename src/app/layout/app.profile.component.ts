import {Component, DoCheck} from '@angular/core';
import {StorageUtil} from "../core/services/storageUtil.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-profile',
    templateUrl: './app.profile.component.html',
    styleUrls: ['./app.profile.component.scss']
})
export class AppProfileComponent implements DoCheck{
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

    constructor(private router: Router) {
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
}
