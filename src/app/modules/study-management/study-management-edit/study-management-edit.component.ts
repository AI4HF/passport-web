import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../shared/models/study.model";

/**
 * A controller to edit the details of a Study object
 */
@Component({
  selector: 'app-study-management-edit',
  templateUrl: './study-management-edit.component.html',
  styleUrl: './study-management-edit.component.scss'
})
export class StudyManagementEditComponent extends BaseComponent implements OnInit {

  study: Study;
  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe(data =>{
      this.study = data['study'];
    });
  }
}
