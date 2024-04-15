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
    try {
      const decodedToken = jwt_decode(token) as { resource_access: { [key: string]: { roles: string[] } } };
      const ai4hfRoles = decodedToken.resource_access["AI4HF-Auth"]?.roles || [];
      return ai4hfRoles;
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

}
