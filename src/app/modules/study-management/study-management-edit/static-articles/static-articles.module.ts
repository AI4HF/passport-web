import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StaticArticlesComponent} from "./static-articles.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {PickListModule} from "primeng/picklist";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TranslateModule} from "@ngx-translate/core";
import {InputTextModule} from "primeng/inputtext";
import {ReactiveFormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {StudyDetailsModule} from "../study-details/study-details.module";

@NgModule({
    declarations: [
        StaticArticlesComponent
    ],
    imports: [
        CommonModule,
        ButtonModule,
        CardModule,
        DropdownModule,
        PickListModule,
        RippleModule,
        SharedModule,
        TranslateModule,
        InputTextModule,
        ReactiveFormsModule,
        TableModule,
        StudyDetailsModule
    ],
    exports: [StaticArticlesComponent]
})
export class StaticArticlesModule { }
