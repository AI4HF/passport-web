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
    const decodedToken = jwt_decode(token) as { resources: string[] };
    return decodedToken.resources;
  }
}
