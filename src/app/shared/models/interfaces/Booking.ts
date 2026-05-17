export interface Booking {
    idBooking:      number;
    title:          string;
    description:    string;
    startDateTime:  Date;
    endDateTime:    Date;
    type:           string;
    status:         string;
    clientName:     string;
    clientPhone:    string;
    clientEmail:    string;
    color:          string;
    createdAt:      Date;
    updatedAt:      null;
    idTattooStudio: number;
    idArtist:       number;
}