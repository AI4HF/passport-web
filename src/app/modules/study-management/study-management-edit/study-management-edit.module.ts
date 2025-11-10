import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {StudyManagementEditComponent} from "./study-management-edit.component";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";
import {TimelineModule} from "primeng/timeline";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";
import {StepperModule} from "../../../shared/components/stepper/stepper.module";
import {StudyDetailsModule} from "./study-details/study-details.module";
import {StudyManagementEditRoutingModule} from "./study-management-edit-routing.module";
import {PopulationDetailsModule} from "./population-details/population-details.module";
import {PersonnelAssignmentModule} from "./personnel-assignment/personnel-assignment.module";
import {ExperimentQuestionsModule} from "./experiment-questions/experiment-questions.module";
import {SurveyInspectionModule} from "./survey-inspection/survey-inspection.module";
import {StaticArticlesModule} from "./static-articles/static-articles.module";



@NgModule({
  declarations: [StudyManagementEditComponent],
    imports: [
        CommonModule,
        CardModule,
        InputTextModule,
        TranslateModule,
        ReactiveFormsModule,
        TimelineModule,
        ButtonModule,
        RippleModule,
        StepperModule,
        StudyDetailsModule,
        StudyManagementEditRoutingModule,
        PopulationDetailsModule,
        PersonnelAssignmentModule,
        ExperimentQuestionsModule,
        StaticArticlesModule,
        SurveyInspectionModule
    ]
})
export class StudyManagementEditModule { }
