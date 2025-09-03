import { ProfileUserDto } from "./ProfileUserDto";

export class LoginUserDto {
    username: string;
    password: string;

    constructor(username: string, password: string){
        this.username = username;
        this.password = password;
    }
}