import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectedStudyDropdownComponent} from "./selected-study-dropdown.component";
import {DropdownModule} from "primeng/dropdown";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";
import {
    StudyDetailsModule
} from "../../../modules/study-management/study-management-edit/study-details/study-details.module";



@NgModule({
  declarations: [SelectedStudyDropdownComponent],
    imports: [
        CommonModule,
        DropdownModule,
        TranslateModule,
        FormsModule,
        StudyDetailsModule
    ],
  exports: [SelectedStudyDropdownComponent]
})
export class SelectedStudyDropdownModule { }
