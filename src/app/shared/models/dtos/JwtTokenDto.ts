import { ProfileUserDto } from "../interfaces/ProfileUserDto";

export class JwtTokenDto {
    token: string;
    userProfile: ProfileUserDto
    constructor(token: string, userProfile: ProfileUserDto){
        this.token = token;
        this.userProfile = userProfile;
    }
}