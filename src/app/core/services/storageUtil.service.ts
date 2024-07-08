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
     * Retrieves the token from storage.
     * @returns The token from either localStorage or sessionStorage.
     */
    static retrieveToken(): string | null {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    /**
     * Removes the token from both localStorage and sessionStorage.
     */
    static removeToken(): void {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
}
