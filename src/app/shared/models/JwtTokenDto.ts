export class JwtTokenDto {
    token: string;
    constructor(token: string){
        this.token = token;
    }
}