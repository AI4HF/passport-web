import { Pipe, PipeTransform } from '@angular/core';

/**
 * Angular pipe that checks whether at least one item in an array
 * has a non-empty value for one or more specified fields.
 *
 * Usage example:
 *   *ngIf="items | hasAnyValue: ['title', 'description']"
 *
 * - Supports both single field (string) and multiple fields (string[]).
 * - Nested fields can be accessed using dot notation (e.g. 'user.name').
 * - Returns `true` if any of the specified fields in any item
 *   contain a non-null, non-undefined, non-empty value.
 */
@Pipe({ name: 'hasAnyValue', standalone: false })
export class HasAnyValuePipe implements PipeTransform {
    transform(items: any[] | null | undefined, fields: string | string[]): boolean {
        if (!Array.isArray(items) || items.length === 0) return false;
        const fieldList = Array.isArray(fields) ? fields : [fields];

        const getByPath = (obj: any, path: string) =>
            path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);

        return items.some(item =>
            fieldList.some(path => {
                const val = getByPath(item, path);
                return val !== null && val !== undefined && String(val).trim().length > 0;
            })
        );
    }
}

