import { Component, OnInit } from '@angular/core';
import {MessageService, PrimeNGConfig} from 'primeng/api';
import {AppConfig, LayoutService} from "./layout/service/app.layout.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    providers: [MessageService]
})
export class AppComponent implements OnInit {
    constructor(private primengConfig: PrimeNGConfig, private layoutService: LayoutService) {
        // Inject data service at the beginning for initialization
    }

    ngOnInit(): void {
        this.primengConfig.ripple = true;

        const config: AppConfig = {
            ripple: true,                    //toggles ripple on and off
            inputStyle: 'filled',           //default style for input elements, valid values are "outlined" and "filled"
            menuMode: 'horizontal',           //layout mode of the menu, valid values are "static", "overlay", "slim", "horizontal", "reveal" and "drawer"
            colorScheme: 'light',  //color scheme of the template, valid values are "light", "dim" and "dark"
            theme: 'red',                    //default component theme for PrimeNG
            menuTheme: "colorScheme",         //theme of the menu, valid values are "colorScheme", "primaryColor" and "transparent"
            scale: 14                         //size of the body font size to scale the whole application
        };
        this.layoutService.config.set(config);
    }
}
