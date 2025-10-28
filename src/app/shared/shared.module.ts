import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HasAnyValuePipe} from "./pipes/has-any-value.pipe";



@NgModule({
  declarations: [HasAnyValuePipe],
  imports: [
    CommonModule
  ],
  exports:[HasAnyValuePipe]
})
export class SharedModule { }
