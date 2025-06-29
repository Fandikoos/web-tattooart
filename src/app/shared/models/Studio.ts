import { Artist } from "./Artist";
import { StudioImage } from "./StudioImage";

export interface Studio {
    idStudio: number;
    name:     string;
    address:  string;
    latitud:  number;
    longitud: number;
    rating:   number;
    logo:     string;
    artists:  Artist[];
    images:   StudioImage[];
}
