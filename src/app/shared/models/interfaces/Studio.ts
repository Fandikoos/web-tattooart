import { Artist } from "./Artist";
import { Image } from "./Image";
import { Review } from "./Review";

export interface Studio {
    idStudio?: number;
    name:     string;
    address:  string;
    latitud:  number;
    longitud: number;
    rating:   number;
    openSchedule: string;
    closeSchedule: string;
    description: string;
    logo:     string;
    idUser: number;
    artists:  Artist[];
    imagesGallery?:   Image[];
    reviews?: Review[];
    isFav?: boolean;
    idFavourite?: any;
}
