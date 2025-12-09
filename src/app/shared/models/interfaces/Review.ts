export interface Review {
    idReview?: number;
    review: string;
    rating: number;
    createdAt?: Date;
    idUser: number;
    idTattooStudio: number;
    username?: string;
}