import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {StorageUtil} from "../core/services/storageUtil.service";

@Component({
    selector: 'app-profile',
    templateUrl: './app.profile.component.html',
    styleUrls: ['./app.profile.component.scss']
})
export class AppProfileComponent {
    /**
     * Menu items displayed under user name
     */
    menu = [
        //   {value: 'profile', label: 'Profile', icon: 'pi pi-user'},
        //   {value: 'settings', label: 'Settings', icon: 'pi pi-cog'},
        {value: 'logout', label: 'Logout', icon: 'pi pi-power-off'}
    ]

    constructor(private router: Router, private storageUtilService:StorageUtil) {
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
        this.storageUtilService.removeToken();
        this.router.navigate(['../login'])
    }
}
