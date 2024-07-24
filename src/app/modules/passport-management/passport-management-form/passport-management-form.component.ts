import {Component, EventEmitter, Injector, Input, OnInit, Output} from '@angular/core';
import {Passport} from "../../../shared/models/passport.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {BaseComponent} from "../../../shared/components/base.component";
import {takeUntil} from "rxjs";
import {ModelDto} from "../../../shared/models/modelDto.model";

/**
 * Component for creating passport.
 */
@Component({
  selector: 'app-passport-management-form',
  templateUrl: './passport-management-form.component.html',
  styleUrl: './passport-management-form.component.scss'
})
export class PassportManagementFormComponent extends BaseComponent implements OnInit {
  /** Event emitted when the form is closed */
  @Output() formClosed = new EventEmitter<void>();

  /** Form group for passport form controls */
  passportForm: FormGroup;
  /** flag indicating that dialog is visible */
  display = false;
  /** All deployed model names that will be displayed at the dropdown menu*/
  modelDtoList: ModelDto[];

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   */
  constructor(protected injector: Injector) {
    super(injector);
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.fetchModelDtoList();
    this.initializeForm();
  }


  /**
   * Initializes the form group.
   */
  initializeForm() {
    this.passportForm = new FormGroup({
      deploymentId: new FormControl(Validators.required)
    });
    this.display = true;
  }


  /**
   * Fetches the model options from the service.
   */
  fetchModelDtoList() {
    this.modelService.getModelListInDeployments().pipe(takeUntil(this.destroy$)).subscribe({
      next: modelDtos => {
        this.modelDtoList = modelDtos;
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
   * Saves the passport.
   */
  savePassport() {
      const newPassport: Passport = new Passport({createdBy: 1, approvedBy: 1,...this.passportForm.value});
      this.passportService.createPassport(newPassport)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: passport => {
              this.initializeForm();
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('Success'),
                detail: this.translateService.instant('PassportManagement.Passport is created successfully')
              });
            },
            error: (error: any) => {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('Error'),
                detail: error.message
              });
            },
            complete: () => {
              this.closeDialog();
            }
          });
  }

  /**
   * Closes the dialog
   */
  closeDialog() {
    this.display = false;
    this.formClosed.emit();
  }
}
