import {Component, Injector} from '@angular/core';
import {BaseComponent} from "../../shared/components/base.component";

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent extends BaseComponent{
    rememberMe: boolean = false;

    constructor(protected injector: Injector) {
        super(injector);
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }
}
