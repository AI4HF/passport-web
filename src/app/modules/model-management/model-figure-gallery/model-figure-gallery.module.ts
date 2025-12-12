import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ModelFigureGalleryComponent} from "./model-figure-gallery.component";
import {DialogModule} from "primeng/dialog";
import {CardModule} from "primeng/card";
import {ModelFigureGalleryRoutingModule} from "./model-figure-gallery-routing.module";
import {ButtonModule} from "primeng/button";
import {StudyDetailsModule} from "../../study-management/study-management-edit/study-details/study-details.module";
import {TranslateModule} from "@ngx-translate/core";
import {RippleModule} from "primeng/ripple";



@NgModule({
    declarations: [ModelFigureGalleryComponent],
    imports: [
        CommonModule,
        DialogModule,
        CardModule,
        ModelFigureGalleryRoutingModule,
        ButtonModule,
        StudyDetailsModule,
        TranslateModule,
        RippleModule
    ],
    exports: [ModelFigureGalleryComponent]
})
export class ModelFigureGalleryModule { }
