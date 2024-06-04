import {Component, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {Personnel} from "../../../../shared/models/personnel.model";
import {takeUntil} from "rxjs";

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
   * The role enumeration TODO: replace with appropriate enum class later
   */
  roles: any[] = [{name: 'Data Scientist', value: 'Data Scientist'}, {name: 'Study Owner', value: 'Study Owner'}];

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.personnelService.getPersonnelList().pipe(takeUntil(this.destroy$))
        .subscribe(personnelList => {
          this.personnelList = personnelList.map(personnel => new Personnel(personnel));
          this.sourcePersonnelList = personnelList.map(personnel => new Personnel(personnel));
        })
  }

  /**
   * Back to population deatils menu
   */
  back(){
    this.router.navigate([`../population-details`], {relativeTo: this.route});
  }

  /**
   * Next to experiment details menu
   */
  next(){
    //TODO:
    console.log(this.targetPersonnelList);
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
