import { Artist } from "./Artist";
import { Image } from "./Image";
import { StudioImage } from "./StudioImage";

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
    isFav?: boolean;
    idFavourite?: any;
}
