/**
 * Utilities used to keep outer components simple by handling the sessionStorage/localStorage logic
 */
export class StorageUtil {

    /**
     * Stores the token in the appropriate storage based on the rememberMe flag.
     * @param token The token to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storeToken(token: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('token', token);
        } else {
            sessionStorage.setItem('token', token);
        }
    }

    /**
     * Stores the userId in the appropriate storage based on the rememberMe flag.
     * @param userId The userUd to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storeUserId(userId: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('userId', userId);
        } else {
            sessionStorage.setItem('userId', userId);
        }
    }

    /**
     * Stores the personnelName in the appropriate storage based on the rememberMe flag.
     * @param personnelName The personnelName to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storePersonnelName(personnelName: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('personnelName', personnelName);
        } else {
            sessionStorage.setItem('personnelName', personnelName);
        }
    }

    /**
     * Stores the personnelName in the appropriate storage based on the rememberMe flag.
     * @param personnelSurname The personnelSurname to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storePersonnelSurname(personnelSurname: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('personnelSurname', personnelSurname);
        } else {
            sessionStorage.setItem('personnelSurname', personnelSurname);
        }
    }

    /**
     * Stores the organizationName in the appropriate storage based on the rememberMe flag.
     * @param organizationName The organizationName to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storeOrganizationName(organizationName: string, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('organizationName', organizationName);
        } else {
            sessionStorage.setItem('organizationName', organizationName);
        }
    }

    /**
     * Stores the organizationId in the appropriate storage based on the rememberMe flag.
     * @param organizationId The organizationId to store.
     * @param rememberMe Whether to remember the user across sessions.
     */
    static storeOrganizationId(organizationId: number, rememberMe: boolean): void {
        if (rememberMe) {
            localStorage.setItem('organizationId', String(organizationId));
        } else {
            sessionStorage.setItem('organizationId', String(organizationId));
        }
    }

    /**
     * Retrieves the token from storage.
     * @returns The token from either localStorage or sessionStorage.
     */
    static retrieveToken(): string | null {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    /**
     * Retrieves the userId from storage.
     * @returns The userId from either localStorage or sessionStorage.
     */
    static retrieveUserId(): string | null {
        return localStorage.getItem('userId') || sessionStorage.getItem('userId');
    }

    /**
     * Retrieves the personnelName from storage.
     * @returns The personnelName from either localStorage or sessionStorage.
     */
    static retrievePersonnelName(): string | null {
        return localStorage.getItem('personnelName') || sessionStorage.getItem('personnelName');
    }

    /**
     * Retrieves the personnelSurname from storage.
     * @returns The personnelSurname from either localStorage or sessionStorage.
     */
    static retrievePersonnelSurname(): string | null {
        return localStorage.getItem('personnelSurname') || sessionStorage.getItem('personnelSurname');
    }

    /**
     * Retrieves the organizationName from storage.
     * @returns The organizationName from either localStorage or sessionStorage.
     */
    static retrieveOrganizationName(): string | null {
        return localStorage.getItem('organizationName') || sessionStorage.getItem('organizationName');
    }

    /**
     * Retrieves the organizationId from storage.
     * @returns The organizationId from either localStorage or sessionStorage.
     */
    static retrieveOrganizationId(): string | null {
        return localStorage.getItem('organizationId') || sessionStorage.getItem('organizationId');
    }

    /**
     * Removes the token from both localStorage and sessionStorage.
     */
    static removeToken(): void {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }

    /**
     * Removes the userId from both localStorage and sessionStorage.
     */
    static removeUserId(): void {
        localStorage.removeItem('userId');
        sessionStorage.removeItem('userId');
    }

    /**
     * Removes the personnelName from both localStorage and sessionStorage.
     */
    static removePersonnelName(): void {
        localStorage.removeItem('personnelName');
        sessionStorage.removeItem('personnelName');
    }

    /**
     * Removes the personnelSurname from both localStorage and sessionStorage.
     */
    static removePersonnelSurname(): void {
        localStorage.removeItem('personnelSurname');
        sessionStorage.removeItem('personnelSurname');
    }

    /**
     * Removes the organizationName from both localStorage and sessionStorage.
     */
    static removeOrganizationName(): void {
        localStorage.removeItem('organizationName');
        sessionStorage.removeItem('organizationName');
    }

    /**
     * Removes the organizationId from both localStorage and sessionStorage.
     */
    static removeOrganizationId(): void {
        localStorage.removeItem('organizationId');
        sessionStorage.removeItem('organizationId');
    }
}
