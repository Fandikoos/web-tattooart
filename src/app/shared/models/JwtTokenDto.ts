import { ProfileUserDto } from "./ProfileUserDto";

export class JwtTokenDto {
    token: string;
    userProfile: ProfileUserDto
    constructor(token: string, userProfile: ProfileUserDto){
        this.token = token;
        this.userProfile = userProfile;
    }
}