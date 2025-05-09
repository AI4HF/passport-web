import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from "../../../shared/components/base.component";
import { Model } from "../../../shared/models/model.model";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from "rxjs/operators";
import { LearningProcess } from "../../../shared/models/learningProcess.model";
import {HttpClient} from "@angular/common/http";
import {Experiment} from "../../../shared/models/experiment.model";
import {forkJoin} from "rxjs";

/**
 * Component for creating or updating model.
 */
@Component({
  selector: 'app-model-management-form',
  templateUrl: './model-management-form.component.html',
  styleUrls: ['./model-management-form.component.scss']
})
export class ModelManagementFormComponent extends BaseComponent implements OnInit {

  /** The ID of the model to be edited */
  @Input() modelId: string;
  /** Event emitted when the form is closed */
  @Output() formClosed = new EventEmitter<void>();
  /** The selected model */
  selectedModel: Model;
  /** Form group for model form controls */
  modelForm: FormGroup;
  /** List of learning processes */
  learningProcess: LearningProcess[] = [];
  /** List of experiments */
  experiments: Experiment[] = [];
  /** Flag indicating that dialog is visible */
  display = false;

  /** Hardcoded list of models for auto-fill */
  hardcodedModels: Model[] = [];

  /** Filtered list for auto-fill suggestions */
  filteredModels: Model[] = [];

  /**
   * Constructor to inject dependencies.
   * @param injector The dependency injector
   * @param http The HTTP client for loading JSON
   */
  constructor(protected injector: Injector, private http: HttpClient) {
    super(injector);
  }

  /**
   * Initializes the component.
   */
  ngOnInit() {
    this.loadModel();
    this.loadHardcodedModels();
  }

  /**
   * Loads the model details if a model ID is provided.
   */
  loadModel() {
    if (this.modelId) {
      this.modelService.getModelById(this.modelId, this.activeStudyService.getActiveStudy()).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: model => {
              this.selectedModel = new Model(model);
              this.loadLearningProcessAndExperiments();
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
    } else {
      this.selectedModel = new Model({});
      this.loadLearningProcessAndExperiments();
    }
  }

  /**
   * Loads the learning process and experiments to populate the dropdowns.
   */
  loadLearningProcessAndExperiments() {
    const studyId = this.activeStudyService.getActiveStudy();

    forkJoin({
      learningProcess: this.learningProcessService.getAllLearningProcessesByStudyId(studyId),
      experiments: this.experimentService.getExperimentListByStudyId(studyId)
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: ({ learningProcess, experiments }) => {
        this.learningProcess = learningProcess;
        this.experiments = experiments;
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
   * Initializes the form group.
   */
  initializeForm() {
    this.modelForm = new FormGroup({
      learningProcessId: new FormControl(this.selectedModel.learningProcessId, Validators.required),
      experimentId: new FormControl(this.selectedModel.experimentId, Validators.required),
      name: new FormControl(this.selectedModel.name, Validators.required),
      version: new FormControl(this.selectedModel.version, Validators.required),
      tag: new FormControl(this.selectedModel.tag, Validators.required),
      modelType: new FormControl(this.selectedModel.modelType, Validators.required),
      productIdentifier: new FormControl(this.selectedModel.productIdentifier, Validators.required),
      trlLevel: new FormControl(this.selectedModel.trlLevel, Validators.required),
      license: new FormControl(this.selectedModel.license, Validators.required),
      primaryUse: new FormControl(this.selectedModel.primaryUse, Validators.required),
      secondaryUse: new FormControl(this.selectedModel.secondaryUse, Validators.required),
      intendedUsers: new FormControl(this.selectedModel.intendedUsers, Validators.required),
      counterIndications: new FormControl(this.selectedModel.counterIndications, Validators.required),
      ethicalConsiderations: new FormControl(this.selectedModel.ethicalConsiderations, Validators.required),
      limitations: new FormControl(this.selectedModel.limitations, Validators.required),
      fairnessConstraints: new FormControl(this.selectedModel.fairnessConstraints, Validators.required)
    });
    this.display = true;
  }

  /**
   * Filters the hardcoded models based on user input.
   */
  filterModels(event: any) {
    const query = event.query.toLowerCase();
    this.filteredModels = this.hardcodedModels.filter(m =>
        m.name.toLowerCase().includes(query)
    );
  }

  /**
   * Auto-fills the form with the selected hardcoded model.
   */
  selectAutoFill(event: any) {
    const selectedModel = event.value;
    this.modelForm.patchValue({
      name: selectedModel.name,
      version: selectedModel.version,
      tag: selectedModel.tag,
      modelType: selectedModel.modelType,
      productIdentifier: selectedModel.productIdentifier,
      trlLevel: selectedModel.trlLevel,
      license: selectedModel.license,
      primaryUse: selectedModel.primaryUse,
      secondaryUse: selectedModel.secondaryUse,
      intendedUsers: selectedModel.intendedUsers,
      counterIndications: selectedModel.counterIndications,
      ethicalConsiderations: selectedModel.ethicalConsiderations,
      limitations: selectedModel.limitations,
      fairnessConstraints: selectedModel.fairnessConstraints
    });
  }

  /**
   * Saves the model.
   */
  saveModel() {
    if (!this.selectedModel.modelId) {
      const newModel: Model = new Model({ studyId: this.activeStudyService.getActiveStudy(), ...this.modelForm.value });
      this.modelService.createModel(newModel, this.activeStudyService.getActiveStudy())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: model => {
              this.selectedModel = model;
              this.loadLearningProcessAndExperiments();
              this.translateService.get(['Success', 'ModelManagement.Model is created successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['ModelManagement.Model is created successfully']
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
            },
            complete: () => {
              this.closeDialog();
            }
          });
    } else {
      const updatedModel: Model = new Model({ studyId: this.activeStudyService.getActiveStudy(), modelId: this.selectedModel.modelId, ...this.modelForm.value });
      this.modelService.updateModel(updatedModel, this.activeStudyService.getActiveStudy())
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (model: Model) => {
              this.selectedModel = model;
              this.loadLearningProcessAndExperiments();
              this.translateService.get(['Success', 'ModelManagement.Model is updated successfully']).subscribe(translations => {
                this.messageService.add({
                  severity: 'success',
                  summary: translations['Success'],
                  detail: translations['ModelManagement.Model is updated successfully']
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
            },
            complete: () => {
              this.closeDialog();
            }
          });
    }
  }

  /**
   * Closes the dialog
   */
  closeDialog() {
    this.display = false;
    this.formClosed.emit();
  }

  /**
   * Loads the hardcoded model list from a JSON file.
   */
  loadHardcodedModels() {
    this.http.get<Model[]>('assets/data/example-models.json').pipe(takeUntil(this.destroy$))
        .subscribe({
          next: data => this.hardcodedModels = data,
          error: err => console.error('Failed to load hardcoded models', err)
        });
  }
}
