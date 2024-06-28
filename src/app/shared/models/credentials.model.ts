export class Credentials {
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