import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Service to assign and provide the current organization ID to different components.
 */
@Injectable({
    providedIn: 'root'
})
export class OrganizationStateService {
    /**
     * Key used to store the organization ID.
     */
    private readonly organizationIdKey = 'organizationId';

    /**
     * Subject to hold and manage the value of the current organization ID.
     */
    private organizationIdSubject = new BehaviorSubject<number | null>(this.getStoredOrganizationId());

    /**
     * Observable for components to subscribe to the current organization ID.
     */
    organizationId$ = this.organizationIdSubject.asObservable();

    /**
     * Set the given organization ID to the subject and the localstorage.
     */
    setOrganizationId(id: number | null) {
        if (id !== null) {
            localStorage.setItem(this.organizationIdKey, id.toString());
        } else {
            localStorage.removeItem(this.organizationIdKey);
        }
        this.organizationIdSubject.next(id);
    }

    /**
     * Retrieve the set organization ID from the subject.
     */
    getOrganizationId(): number | null {
        return this.organizationIdSubject.getValue();
    }

    /**
     * Method used to get the backup organization ID from the local storage.
     */
    private getStoredOrganizationId(): number | null {
        const storedId = localStorage.getItem(this.organizationIdKey);
        return storedId ? +storedId : null;
    }
}
