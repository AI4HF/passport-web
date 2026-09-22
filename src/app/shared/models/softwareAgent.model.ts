/**
 * Model for SoftwareAgent class
 */
export class SoftwareAgent {
    /**
     * The ID of the SoftwareAgent
     */
    softwareAgentId: string;

    /**
     * The name of the SoftwareAgent
     */
    name: string;

    /**
     * The version of the SoftwareAgent
     */
    version: string;

    /**
     * The description of the SoftwareAgent
     */
    description: string;

    /**
     * The Keycloak service-account client the agent authenticates with
     */
    keycloakClientId: string;

    constructor(data: any) {
        if (!data) {
            return;
        }
        this.softwareAgentId = data.softwareAgentId;
        this.name = data.name;
        this.version = data.version;
        this.description = data.description;
        this.keycloakClientId = data.keycloakClientId;
    }
}
