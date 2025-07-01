import { Component, EventEmitter, Injector, Input, Output } from '@angular/core';
import { BaseComponent } from '../../../../../shared/components/base.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Component that handles the **Connector-Secret** workflow for a newly-created user.
 */
@Component({
    selector: 'app-connector-secret',
    templateUrl: './connector-secret.component.html',
    styleUrls: ['./connector-secret.component.scss']
})
export class ConnectorSecretComponent extends BaseComponent {
    /** Username of the newly-created user. */
    @Input() username!: string;

    /** Password of the newly-created user. */
    @Input() password!: string;

    /** Fired after the dialog is closed, allowing the parent to continue its flow. */
    @Output() closed = new EventEmitter<void>();

    /** Controls the visibility of the <p-dialog>. */
    display = true;

    /** Current step of the workflow. */
    stage: 'confirm' | 'token' = 'confirm';

    /** Spinner flag while the backend request is in progress. */
    loading = false;

    /** The refresh token received from the backend once generated. */
    token = '';

    constructor(protected injector: Injector) {
        super(injector);
    }

    /**
     * Handler for no desire for connector token.
     */
    onNo(): void {
        this.close();
    }

    /**
     * Handler to handle the cases where the 'yes' button is used
     */
    onYesGenerate(): void {
        this.loading = true;
        this.authorizationService.refreshTokenSignup(this.username, this.password)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (t) => {
                    this.token = t;
                    this.stage = 'token';
                },
                error: (err) => {
                    this.translateService.get('Error').subscribe(txt =>
                        this.messageService.add({
                            severity: 'error',
                            summary: txt,
                            detail: err.message
                        })
                    );
                    this.close();
                },
                complete: () => (this.loading = false)
            });
    }

    /**
     * Copies the obtained token to the clipboard and displays a success toast.
     */
    copyToken(): void {
        navigator.clipboard.writeText(this.token).then(() =>
            this.translateService
                .get(['Success', 'OrganizationManagement.Copied'])
                .subscribe(tr =>
                    this.messageService.add({
                        severity: 'success',
                        summary: tr['Success'],
                        detail: tr['OrganizationManagement.Copied']
                    })
                )
        );
    }

    /**
     * Closes the dialog and emits link so the parent component can react.
     */
    close(): void {
        this.display = false;
        this.closed.emit();
    }
}
