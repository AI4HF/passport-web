import {Component, EventEmitter, Injector, OnInit, Output} from '@angular/core';
import {BaseComponent} from "../../../../shared/components/base.component";
import {Organization} from "../../../../shared/models/organization.model";
import {JwtHelperService} from "@auth0/angular-jwt";
import {StorageUtil} from "../../../../core/services/storageUtil.service";
import {takeUntil} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Component for edit the details of an Organization
 */
@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.scss'
})
export class OrganizationDetailsComponent extends BaseComponent implements OnInit{

  /** The currently selected organization */
  selectedOrganization: Organization;

  /** The form group for the organization */
  organizationForm: FormGroup;

  /** Set organizationId for personnel component */
  @Output() organizationId: EventEmitter<string> = new EventEmitter<string>();

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit(){
    // Get organization admin id from access token
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(StorageUtil.retrieveToken());
    const organizationAdminId = decodedToken.user_id;

    // Fetch related organization object
    this.organizationService.getOrganizationByOrganizationAdminId(organizationAdminId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: organization => {
            this.selectedOrganization = new Organization(organization);
            if(this.selectedOrganization.organizationId){
              this.organizationId.emit(this.selectedOrganization.organizationId);
            }
            this.selectedOrganization.organizationAdminId = organizationAdminId;
            this.initializeForm();
          },
          error: error => {
            this.translateService.get('Error').subscribe(translation => {
              this.messageService.add({
                severity: 'error',
                summary: translation,
                detail: error.message
              });
            });
          }
        });
  }

  /**
   * Initializes the form group organization
   */
  initializeForm(){
    this.organizationForm =  new FormGroup({
      name: new FormControl(this.selectedOrganization.name || '', Validators.required),
      address: new FormControl(this.selectedOrganization.address || '', Validators.required)
    });
  }

  /**
   * Saves the organization, either creating a new one or updating an existing one.
   */
  save(){
    if(this.selectedOrganization.organizationId){
      const updatedOrganization = new Organization({...this.selectedOrganization, ...this.organizationForm.value});
      this.organizationService.updateOrganization(updatedOrganization)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: organization => {
              this.selectedOrganization = new Organization(organization);
              this.initializeForm();
              this.organizationId.emit(this.selectedOrganization.organizationId);
              this.translateService.get(['Success', 'OrganizationManagement.Organization is updated successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['OrganizationManagement.Organization is updated successfully']
                });
              });
            },
            error: (error: any) => {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
              });
            }
          });
    }else{
      const newOrganization = new Organization({...this.selectedOrganization, ...this.organizationForm.value});
      this.organizationService.createOrganization(newOrganization)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: organization => {
              this.selectedOrganization = new Organization(organization);
              this.initializeForm();
              this.organizationId.emit(this.selectedOrganization.organizationId);
              this.translateService.get(['Success', 'OrganizationManagement.Organization is created successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['OrganizationManagement.Organization is created successfully']
                });
              });
            },
            error: (error: any) => {
              this.translateService.get('Error').subscribe(translation => {
                this.messageService.add({
                  severity: 'error',
                  summary: translation,
                  detail: error.message
                });
              });
            }
          });
    }
  }
}
