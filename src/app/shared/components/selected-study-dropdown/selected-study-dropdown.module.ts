import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SelectedStudyDropdownComponent} from "./selected-study-dropdown.component";
import {DropdownModule} from "primeng/dropdown";
import {TranslateModule} from "@ngx-translate/core";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [SelectedStudyDropdownComponent],
  imports: [
    CommonModule,
    DropdownModule,
    TranslateModule,
    FormsModule
  ],
  exports: [SelectedStudyDropdownComponent]
})
export class SelectedStudyDropdownModule { }
