export interface Review {
    idReview: number;
    review: string;
    rating: number;
    createdAt: Date;
    idUser: number;
    idStudio: number;
    username: string;
}