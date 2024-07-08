/**
 * Username-Password couple body for Login requests
 */
export class Credentials {
    /**
     * Username and password of the user
     */
    username: string;
    password: string;

    constructor(data: any) {

        if(!data){
            return;
        }
        this.username = data.username;
        this.password = data.password;
    }
}