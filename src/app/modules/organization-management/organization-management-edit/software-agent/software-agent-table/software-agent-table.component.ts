import { Component, Injector, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from "../../../../../shared/components/base.component";
import { SoftwareAgent } from "../../../../../shared/models/softwareAgent.model";

/**
 * Component to display and manage the registry of software agents: the automated integrations
 * that write to the Passport with their own Keycloak service accounts.
 */
@Component({
    selector: 'app-software-agent-table',
    templateUrl: './software-agent-table.component.html',
    styleUrls: ['./software-agent-table.component.scss']
})
export class SoftwareAgentTableComponent extends BaseComponent implements OnInit {
    /** List of software agents */
    softwareAgentList: SoftwareAgent[];
    /** Columns to be displayed in the table */
    columns: any[];
    /** Loading state of the table */
    loading: boolean = true;
    /** Determines if the form is displayed */
    displayForm: boolean = false;
    /** The ID of the selected software agent for editing */
    selectedSoftwareAgentId: string;

    /**
     * Constructor to inject dependencies.
     * @param injector The dependency injector
     */
    constructor(protected injector: Injector) {
        super(injector);
        this.columns = [
            { header: 'Name', field: 'name' },
            { header: 'Version', field: 'version' },
            { header: 'Keycloak Client', field: 'keycloakClientId' },
            { header: 'Description', field: 'description' }
        ];
    }

    /**
     * Initializes the component.
     */
    ngOnInit() {
        this.loadSoftwareAgentList();
    }

    /**
     * Loads the registry of software agents.
     */
    loadSoftwareAgentList() {
        this.softwareAgentService.getSoftwareAgentList().pipe(takeUntil(this.destroy$)).subscribe({
            next: softwareAgents => {
                this.softwareAgentList = softwareAgents;
            },
            error: (error) => {
                this.loading = false;
                this.translateService.get('Error').subscribe(translation => {
                    this.messageService.add({
                        severity: 'error',
                        summary: translation,
                        detail: error.message
                    });
                });
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    /**
     * Filters the table globally based on the input event.
     * @param table The table to be filtered
     * @param event The input event
     */
    filter(table: any, event: Event): void {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    /**
     * Opens the form for a new software agent.
     */
    createSoftwareAgent() {
        this.selectedSoftwareAgentId = null;
        this.displayForm = true;
    }

    /**
     * Opens the form for an existing software agent.
     * @param softwareAgent The software agent to be edited
     */
    editSoftwareAgent(softwareAgent: SoftwareAgent) {
        this.selectedSoftwareAgentId = softwareAgent.softwareAgentId;
        this.displayForm = true;
    }

    /**
     * Deletes a software agent.
     * @param softwareAgentId The ID of the software agent to be deleted
     */
    deleteSoftwareAgent(softwareAgentId: string) {
        this.softwareAgentService.deleteSoftwareAgent(softwareAgentId).pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.softwareAgentList = this.softwareAgentList.filter(a => a.softwareAgentId !== softwareAgentId);
                this.translateService.get(['Success', 'SoftwareAgent.Software agent is deleted successfully']).subscribe(translations => {
                    this.messageService.add({
                        severity: 'success',
                        summary: translations['Success'],
                        detail: translations['SoftwareAgent.Software agent is deleted successfully']
                    });
                });
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
     * Reloads the list once the form is closed.
     */
    onFormClosed() {
        this.displayForm = false;
        this.loadSoftwareAgentList();
    }
}
