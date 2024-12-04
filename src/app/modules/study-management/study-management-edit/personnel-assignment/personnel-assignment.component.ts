import { Component, Injector, OnInit } from '@angular/core';
import { BaseComponent } from "../../../../shared/components/base.component";
import { Personnel } from "../../../../shared/models/personnel.model";
import { takeUntil } from "rxjs";
import { ROLES } from "../../../../shared/models/roles.constant";
import { NameAndValueInterface } from "../../../../shared/models/nameAndValue.interface";
import { Organization } from "../../../../shared/models/organization.model";
import { StudyOrganization } from "../../../../shared/models/studyOrganization.model";
import { Role } from "../../../../shared/models/role.enum";
import { Population } from "../../../../shared/models/population.model";

@Component({
  selector: 'app-personnel-assignment',
  templateUrl: './personnel-assignment.component.html',
  styleUrl: './personnel-assignment.component.scss'
})
export class PersonnelAssignmentComponent extends BaseComponent implements OnInit {
  personnelList: Personnel[] = [];
  organizationList: Organization[] = [];
  populationList: Population[] = [];
  selectedPopulationId: number = null;
  selectedStudyOrganization: StudyOrganization = null;
  roles: NameAndValueInterface[] = ROLES.filter(role => role.value !== Role.STUDY_OWNER);
  selectedResponsiblePersonnelId: string = null;
  personnelRoleMap: Map<string, string[]> = new Map();
  formDisabled: boolean = true;
  studyId: number;

  constructor(protected injector: Injector) {
    super(injector);
  }

  ngOnInit() {
    this.organizationService.getAllOrganizations().pipe(takeUntil(this.destroy$)).subscribe({
      next: data => this.organizationList = data.map(organization => new Organization(organization)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.OrganizationFetchError')
        });
      }
    });

    this.route.parent.paramMap.pipe(takeUntil(this.destroy$)).subscribe({
      next: params => {
        this.studyId = +params.get('id');
        this.loadPopulations();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.RouteFetchError')
        });
      }
    });
  }

  private loadPopulations() {
    this.populationService.getPopulationByStudyId(this.studyId).pipe(takeUntil(this.destroy$)).subscribe({
      next: populations => this.populationList = populations.map(pop => new Population(pop)),
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.PopulationFetchError')
        });
      }
    });
  }

  selectAnOrganization(organizationId: number) {
    this.selectedStudyOrganization = null;
    this.selectedResponsiblePersonnelId = null;
    this.formDisabled = true;
    this.studyOrganizationService.getStudyOrganizationByStudyIdAndOrganizationId(this.studyId, organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: response => {
        this.selectedStudyOrganization = new StudyOrganization(response);
        this.selectedPopulationId = this.selectedStudyOrganization.populationId;
        this.selectedResponsiblePersonnelId = this.selectedStudyOrganization.personnelId;
        this.formDisabled = false;
        this.fetchPersonnelForOrganization(organizationId);
      },
      error: error => {
        if (error.status === 404) {
          this.formDisabled = false;
          this.selectedStudyOrganization = new StudyOrganization({
            studyId: this.studyId,
            organizationId: organizationId
          });
          this.fetchPersonnelForOrganization(organizationId);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('Error'),
            detail: this.translateService.instant('StudyManagement.Personnel.StudyOrganizationFetchError')
          });
        }
      }
    });
  }

  private fetchPersonnelForOrganization(organizationId: number) {
    this.personnelService.getPersonnelByOrganizationId(organizationId).pipe(takeUntil(this.destroy$)).subscribe({
      next: personnel => {
        this.personnelList = personnel.map(p => new Personnel(p));
        this.personnelRoleMap = new Map(this.personnelList.map(p => [p.personId, []]));
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Error'),
          detail: this.translateService.instant('StudyManagement.Personnel.PersonnelFetchError')
        });
      }
    });
  }

  save() {
    const personnelRoleMap = new Map<string, string[]>();

    // Convert the current personnelRoleMap entries into a Map<string, string[]>
    this.personnelRoleMap.forEach((roles, personId) => {
      personnelRoleMap.set(personId, roles);
    });

    // Send the Map<string, string[]> directly to the service method
    this.studyPersonnelService.createStudyPersonnelEntries(this.studyId, this.selectedStudyOrganization.organizationId, personnelRoleMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('Success'),
              detail: this.translateService.instant('StudyManagement.Personnel.RolesAssignedSuccess')
            });
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('Error'),
              detail: this.translateService.instant('StudyManagement.Personnel.SaveError')
            });
          }
        });
  }


  onRoleChange(personnel: Personnel, role: string, isChecked: boolean) {
    const currentRoles = this.personnelRoleMap.get(personnel.personId) || [];
    if (isChecked) {
      currentRoles.push(role);
    } else {
      this.personnelRoleMap.set(personnel.personId, currentRoles.filter(r => r !== role));
    }
    this.personnelRoleMap.set(personnel.personId, [...new Set(currentRoles)]); // Ensure unique roles
  }
}