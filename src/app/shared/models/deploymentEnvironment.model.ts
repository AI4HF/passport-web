/**
 * Model for DeploymentEnvironment class
 */
export class DeploymentEnvironment{
    /**
     * The ID of the DeploymentEnvironment
     */
    environmentId: number;

    /**
     * The title of the DeploymentEnvironment
     */
    title: string;

    /**
     * The description of the DeploymentEnvironment
     */
    description: string;

    /**
     * Hardware properties of the DeploymentEnvironment
     */
    hardwareProperties: string;

    /**
     * Software properties of the DeploymentEnvironment
     */
    softwareProperties: string;

    /**
     * Connectivity details of the DeploymentEnvironment
     */
    connectivityDetails: string;


    constructor(data: any) {

        if(!data){
            return;
        }

        this.environmentId = data.environmentId;
        this.title = data.title;
        this.description = data.description;
        this.hardwareProperties = data.hardwareProperties;
        this.softwareProperties = data.softwareProperties;
        this.connectivityDetails = data.connectivityDetails;
    }
}