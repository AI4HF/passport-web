import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageUtil {

    /**
     * Stores the token in the appropriate storage based on the rememberMe flag.
     * @param token The token to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    storeToken(token: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
    }

    /**
     * Retrieves the token from storage.
     * @returns The token from either localStorage or sessionStorage.
     */
    retrieveToken(): string | null {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    /**
     * Removes the token from both localStorage and sessionStorage.
     */
    removeToken(): void {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
}
