import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrganizationStateService {
    private readonly organizationIdKey = 'organizationId';
    private organizationIdSubject = new BehaviorSubject<number | null>(this.getStoredOrganizationId());
    organizationId$ = this.organizationIdSubject.asObservable();

    setOrganizationId(id: number | null) {
        if (id !== null) {
            localStorage.setItem(this.organizationIdKey, id.toString());
        } else {
            localStorage.removeItem(this.organizationIdKey);
        }
        this.organizationIdSubject.next(id);
    }

    getOrganizationId(): number | null {
        return this.organizationIdSubject.getValue();
    }

    private getStoredOrganizationId(): number | null {
        const storedId = localStorage.getItem(this.organizationIdKey);
        return storedId ? parseInt(storedId, 10) : null;
    }
}
