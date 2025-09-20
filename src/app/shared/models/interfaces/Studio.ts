import { Artist } from "./Artist";
import { StudioImage } from "./StudioImage";

export interface Studio {
    idStudio: number;
    name:     string;
    address:  string;
    latitud:  number;
    longitud: number;
    rating:   number;
    openSchedule: string;
    closeSchedule: string;
    description: string;
    logo:     string;
    artists:  Artist[];
    images:   StudioImage[];
    isFav?: boolean;
    idFavourite?: any;
}
