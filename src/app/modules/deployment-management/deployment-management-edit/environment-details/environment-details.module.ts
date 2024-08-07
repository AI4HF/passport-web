import { NgModule } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {EnvironmentDetailsComponent} from "./environment-details.component";



@NgModule({
    declarations: [EnvironmentDetailsComponent],
    imports: [
        ButtonModule,
        CardModule,
        InputTextModule,
        ReactiveFormsModule,
        RippleModule,
        TranslateModule,
        NgIf,
        CommonModule
    ],
    exports: [EnvironmentDetailsComponent]
})
export class EnvironmentDetailsModule { }
