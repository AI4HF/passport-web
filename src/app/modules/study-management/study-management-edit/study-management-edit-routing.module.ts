import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {StudyDetailsComponent} from "./study-details/study-details.component";
import {StudyManagementEditComponent} from "./study-management-edit.component";
import {PopulationDetailsComponent} from "./population-details/population-details.component";
import {PersonnelAssignmentComponent} from "./personnel-assignment/personnel-assignment.component";
import {ExperimentQuestionsComponent} from "./experiment-questions/experiment-questions.component";
import {SurveyInspectionComponent} from "./survey-inspection/survey-inspection.component";
import {studyDetailsGuard } from "../../../core/guards/study-details.guard"


const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'study-details',
                pathMatch: 'full' // match the full url to avoid infitine redirection
            },
            {
                path: 'study-details',
                component: StudyDetailsComponent,
            },
            {
                path: 'population-details',
                component: PopulationDetailsComponent,
                canActivate: [studyDetailsGuard]
            },
            {
                path: 'personnel-assignment',
                component: PersonnelAssignmentComponent,
                canActivate: [studyDetailsGuard]
            },
            {
                path: 'experiment-questions',
                component: ExperimentQuestionsComponent,
                canActivate: [studyDetailsGuard]
            },
            {
                path: 'survey-inspection',
                component: SurveyInspectionComponent,
                canActivate: [studyDetailsGuard]
            }
        ],
        component: StudyManagementEditComponent
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudyManagementEditRoutingModule {
}
