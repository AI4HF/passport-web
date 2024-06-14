import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {Personnel} from "../../../../shared/models/personnel.model";
import {combineLatest, takeUntil} from "rxjs";

@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit{

  /**
   * The original personnel list provided from personnel service
   */
  personnelList: Personnel[] = [];

  /**
   * The left side list for picklist
   */
  sourcePersonnelList: Personnel[] = [];

  /**
   * The right side list for picklist
   */
  targetPersonnelList: Personnel[] = [];

  /**
   * The studyId for selected study
   */
  studyId: number;
  /**
   * The role enumeration TODO: replace with appropriate enum class later
   */
  roles: any[] = [{name: 'Data Scientist', value: 'Data Scientist'}, {name: 'Study Owner', value: 'Study Owner'}, {name: 'test', value: 'test'}];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.route.parent.data.pipe(takeUntil(this.destroy$)).subscribe({
      next: data => {
        this.studyId = data['study'].id;
        this.fetchPersonnelAndAssignmentLists(this.studyId);
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: error.message
        });
      }
    });
  }

  /**
   * Fetch Available personnel and assigned personnel lists
   * @param studyId ID of the study
   */
  private fetchPersonnelAndAssignmentLists(studyId: number){
    combineLatest([this.personnelService.getAllPersonnel(), this.studyPersonnelService.getPersonnelListByStudyId(studyId)],
      (allPersonnel, assignedPersonnel) => ({allPersonnel, assignedPersonnel}))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: personnelList => {
          this.personnelList = personnelList.allPersonnel;
          this.sourcePersonnelList = this.removeAssignedPersonnelFromPersonnelList(personnelList.allPersonnel, personnelList.assignedPersonnel);
          this.targetPersonnelList = personnelList.assignedPersonnel.map(personnel => new Personnel(personnel));
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
   * Remove Assigned personnel from all personnel list
   * @param personnelList Personnel list includes all personnel
   * @param assignedPersonnelList Personnel list includes only assigned personnel
   */
  private removeAssignedPersonnelFromPersonnelList(personnelList: Personnel[],
                                                   assignedPersonnelList: Personnel[]): Personnel[] {
    return personnelList.filter(allPersonnelElement =>
        !assignedPersonnelList.some(assignedPersonnelElement =>
            assignedPersonnelElement.personId === allPersonnelElement.personId))
        .map(personnel => new Personnel(personnel));
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../population-details`], {relativeTo: this.route});
  }

  /**
   * Save assigned personnel
   */
  save(){
    this.studyPersonnelService.createStudyPersonnelAssignment(this.studyId, this.targetPersonnelList)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: response => {
            this.fetchPersonnelAndAssignmentLists(this.studyId);
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Personnel.Personnel are assigned successfully')
            });
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
   * Handle the event when items are moved to source list
   */
  onMoveToSource(event: any) {
    event.items.forEach((item: Personnel) => {
      // Change the role to default role of the personnel
      const targetPersonnel = this.personnelList.find(personnel => personnel.personId === item.personId);
      item.role = targetPersonnel.role;
    });
  }

  /**
   * Check personnel whether it is in the target list
   */
  isPersonnelInTarget(personnel: Personnel): boolean {
    return this.targetPersonnelList.includes(personnel);
  }

}
