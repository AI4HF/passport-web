import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Shared component to display cascade deletion validation results.
 */
@Component({
    selector: 'app-cascade-validation-dialog',
    templateUrl: './cascade-validation-dialog.component.html',
    styleUrls: ['./cascade-validation-dialog.component.scss']
})
export class CascadeValidationDialogComponent {

    /** Controls visibility of the dialog */
    @Input() display: boolean = false;

    /** Comma separated string of tables */
    @Input() set tables(value: string) {
        this.tableList = value ? value.split(',').filter(t => t.trim() !== '') : [];
    }

    /** Boolean flag: true if deletion is authorized, false if unauthorized */
    @Input() authorized: boolean = false;

    /** Event emitted when the user confirms the action */
    @Output() confirm = new EventEmitter<void>();

    /** Event emitted when the dialog is closed or cancelled */
    @Output() cancel = new EventEmitter<void>();

    /** Parsed list of tables for display */
    tableList: string[] = [];

    constructor() { }

    /**
     * Emits the confirm event.
     */
    onConfirm() {
        this.confirm.emit();
        this.display = false;
    }

    /**
     * Emits the cancel event and hides dialog.
     */
    onCancel() {
        this.cancel.emit();
        this.display = false;
    }
}