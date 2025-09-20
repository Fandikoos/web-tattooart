export class FavouriteDto {
    idUser: number;
    idStudio: number;

    constructor(idUser: number, idStudio: number){
        this.idUser = idUser;
        this.idStudio = idStudio;
    }
}