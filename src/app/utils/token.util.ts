import jwt_decode from "jwt-decode";

/**
 * Token Utility which provides helper methods for Tokens.
 */
export class TokenUtil {
  /**
   * Resource extraction method which handles the extraction of the roles from the provided Token.
   * @param token Token parameter which is usually the user's own Keycloak token.
   */
  static extractUserRoles(token: string): string[] {
    let roles: string[] = [];
    try {
      const decodedToken: any = jwt_decode(token);
      if (decodedToken && decodedToken.resource_access && decodedToken.resource_access['AI4HF-Auth']) {
        const clientRoles = decodedToken.resource_access['AI4HF-Auth'].roles;
        if (clientRoles && Array.isArray(clientRoles)) {
          roles = clientRoles;
        }
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return roles;
  }
}
