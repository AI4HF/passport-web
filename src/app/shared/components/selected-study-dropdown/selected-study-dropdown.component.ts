import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../base.component";
import {Study} from "../../models/study.model";
import {takeUntil} from "rxjs/operators";

/**
 * Selected Study Dropdown component for select active study
 */
@Component({
  selector: 'app-selected-study-dropdown',
  templateUrl: './selected-study-dropdown.component.html',
  styleUrl: './selected-study-dropdown.component.scss'
})
export class SelectedStudyDropdownComponent extends BaseComponent implements OnInit{

  /** Emit event when selected study changes */
  @Output() onChangeStudy = new EventEmitter<number>();
  /** List of studies */
  studies: Study[] = [];
  /** The ID of the selected study */
  selectedStudyId: number = null;

  ngOnInit() {
    this.activeStudyService.fetchStudies().pipe(takeUntil(this.destroy$))
        .subscribe({
          next: studies => {
            this.studies = studies.map(study => new Study(study));
            if(this.activeStudyService.getActiveStudy()){
              this.selectedStudyId = this.activeStudyService.getActiveStudy().id;
              this.changeStudy(this.selectedStudyId);
            }
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: error.message
            });
          }
        });
  }

  /**
   * Change active study
   * @param studyId ID of the study
   */
  changeStudy(studyId: number) {
    this.activeStudyService.setActiveStudy(studyId);
    this.onChangeStudy.emit(this.activeStudyService.getActiveStudy().id);
  }
}
