import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {Study} from "../../../shared/models/study.model";
import {Table} from "primeng/table";
import {StudyManagementRoutingModule} from "../study-management-routing.module";

@Component({
  selector: 'app-study-management-dashboard',
  templateUrl: './study-management-dashboard.component.html',
  styleUrl: './study-management-dashboard.component.scss'
})
export class StudyManagementDashboardComponent extends BaseComponent implements OnInit{

  studyList: Study[] = [];

  // columns of Study to be displayed on a table
  columns: any[];

  // flag indicating the care management objects are being retrieved from the server
  loading: boolean = true;

  constructor(protected injector: Injector) {
    super(injector);

    // initialize variables
    this.columns = [
      {header: 'ID', field: 'id'},
      {header: 'Name', field: 'name'},
      {header: 'Description', field: 'description'},
      {header: 'Objectives', field: 'objectives'},
      {header: 'Ethics', field: 'ethics'}
    ];
  }

  ngOnInit() {
    this.getStudyList();
  }

  /**
   * Retrieves all studies from the server
   */
  getStudyList(){
    this.studyManagementService.getStudyList()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (studyList) => this.studyList = studyList,
          error: (error) => console.log(error),
          complete: () => this.loading = false
        });
  }

  /**
   * Filters a table of information based on a given search criteria
   * @param table Table to be filtered
   * @param event Keyboard type event where search text is captured
   */
  filter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  /**
   * Navigate the user to Study create page
   */
  createStudy(){

  }

  /**
   * Navigate the user to Study edit page
   */
  editStudy(id: number){
    this.router.navigate([`/${StudyManagementRoutingModule.route}/${id}`]);
  }

  /**
   * Delete a study
   */
  deleteStudy(){

  }

}
