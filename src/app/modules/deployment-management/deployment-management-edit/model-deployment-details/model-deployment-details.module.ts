import { NgModule } from '@angular/core';
import {CommonModule, NgIf} from '@angular/common';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TranslateModule} from "@ngx-translate/core";
import {ModelDeploymentDetailsComponent} from "./model-deployment-details.component";
import {DropdownModule} from "primeng/dropdown";



@NgModule({
    declarations: [ModelDeploymentDetailsComponent],
    imports: [
        ButtonModule,
        CardModule,
        InputTextModule,
        ReactiveFormsModule,
        RippleModule,
        TranslateModule,
        DropdownModule,
        NgIf
    ],
    exports: [ModelDeploymentDetailsComponent]
})
export class ModelDeploymentDetailsModule { }
