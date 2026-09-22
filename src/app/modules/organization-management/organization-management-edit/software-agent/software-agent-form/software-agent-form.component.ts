import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { SoftwareAgent } from "../../../../../shared/models/softwareAgent.model";

/**
 * Component for creating and editing a software agent.
 */
@Component({
    selector: 'app-software-agent-form',
    templateUrl: './software-agent-form.component.html',
    styleUrls: ['./software-agent-form.component.scss']
})
export class SoftwareAgentFormComponent extends BaseComponent implements OnInit {
    /** The ID of the software agent to be edited */
    @Input() softwareAgentId: string;
    /** Event emitted when the form is closed */
    @Output() formClosed = new EventEmitter<void>();

    /** The software agent being edited */
    selectedSoftwareAgent: SoftwareAgent = new SoftwareAgent({});
    /** Form group for software agent form controls */
    softwareAgentForm: FormGroup;
    /** flag indicating that dialog is visible */
    display = false;

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
        if (this.softwareAgentId) {
            this.loadSoftwareAgent(this.softwareAgentId);
        } else {
            this.initializeForm();
        }
    }

    /**
     * Loads the software agent to be edited.
     * @param softwareAgentId The ID of the software agent
     */
    loadSoftwareAgent(softwareAgentId: string) {
        this.softwareAgentService.getSoftwareAgentById(softwareAgentId).pipe(takeUntil(this.destroy$)).subscribe({
            next: softwareAgent => {
                this.selectedSoftwareAgent = softwareAgent;
                this.initializeForm();
            },
            error: (error) => {
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
        this.softwareAgentForm = new FormGroup({
            name: new FormControl(this.selectedSoftwareAgent.name, Validators.required),
            version: new FormControl(this.selectedSoftwareAgent.version),
            keycloakClientId: new FormControl(this.selectedSoftwareAgent.keycloakClientId, Validators.required),
            description: new FormControl(this.selectedSoftwareAgent.description)
        });
        this.display = true;
    }

    /**
     * Saves the software agent.
     */
    saveSoftwareAgent() {
        const softwareAgent: SoftwareAgent = new SoftwareAgent({
            ...this.selectedSoftwareAgent,
            ...this.softwareAgentForm.value
        });

        const request = this.softwareAgentId
            ? this.softwareAgentService.updateSoftwareAgent(softwareAgent)
            : this.softwareAgentService.createSoftwareAgent(softwareAgent);
        const messageKey = this.softwareAgentId
            ? 'SoftwareAgent.Software agent is updated successfully'
            : 'SoftwareAgent.Software agent is created successfully';

        request.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.translateService.get(['Success', messageKey]).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations[messageKey]
                    });
                });
                this.closeDialog();
            },
            error: (error) => {
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
     * Closes the dialog.
     */
    closeDialog() {
        this.display = false;
        this.formClosed.emit();
    }
}
