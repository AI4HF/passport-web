import {Component, OnInit} from '@angular/core';

/**
 * A controller to edit the details of a Organization and related Personnel
 */
@Component({
  selector: 'app-organization-management-edit',
  templateUrl: './organization-management-edit.component.html',
  styleUrl: './organization-management-edit.component.scss'
})
export class OrganizationManagementEditComponent implements OnInit{

  /** The currently selected organization ID */
  selectedOrganizationId: number;

  constructor() {
  }

  ngOnInit(){
    this.selectedOrganizationId = 0;
  }

  /** Set selected organization id
   *  @param selectedOrganizationId The id of organization
   */
  setSelectedOrganizationId(selectedOrganizationId: number){
    this.selectedOrganizationId = selectedOrganizationId;
  }
}
