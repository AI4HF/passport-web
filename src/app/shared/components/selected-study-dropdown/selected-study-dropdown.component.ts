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
  @Output() onChangeStudy = new EventEmitter<string>();
  /** List of studies */
  studies: Study[] = [];
  /** The ID of the selected study */
  selectedStudyId: string = null;

  ngOnInit() {
  }

  /**
   * Change active study
   * @param studyId ID of the study
   */
  changeStudy(studyId: string) {
    this.activeStudyService.setActiveStudy(studyId);
    this.onChangeStudy.emit(this.activeStudyService.getActiveStudy());
  }
}
