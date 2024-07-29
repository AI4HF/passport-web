/**
 * Response model for authorization tokens and session information.
 */
export class AuthResponse {
    /**
     * Access token for authorization.
     */
    access_token: string;

    /**
     * Error code, if any.
     */
    error: string | null;

    /**
     * Detailed description of the error, if any.
     */
    error_description: string | null;

    /**
     * URI to more information about the error, if any.
     */
    error_uri: string | null;

    /**
     * The number of seconds until the access token expires.
     */
    expires_in: number;

    /**
     * ID token for authorization.
     */
    id_token: string | null;

    /**
     * The timestamp before which the token is not valid.
     */
    not_before_policy: number;

    /**
     * The number of seconds until the refresh token expires.
     */
    refresh_expires_in: number;

    /**
     * Refresh token to obtain a new access token.
     */
    refresh_token: string;

    /**
     * The scope of the access token.
     */
    scope: string;

    /**
     * The session state identifier.
     */
    session_state: string;

    /**
     * The type of the token.
     */
    token_type: string;

    constructor(data: any) {

        if(!data){
            return;
        }

        this.access_token = data.access_token;
        this.error = data.error;
        this.error_description = data.error_description;
        this.error_uri = data.error_uri;
        this.expires_in = data.expires_in;
        this.id_token = data.id_token;
        this.not_before_policy = data.not_before_policy;
        this.refresh_expires_in = data.refresh_expires_in;
        this.refresh_token = data.refresh_token;
        this.scope = data.scope;
        this.session_state = data.session_state;
        this.token_type = data.token_type;
    }
}