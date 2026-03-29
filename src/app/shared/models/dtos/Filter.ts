export class Filter {
    name: string;
    minRating: number;
    maxRating: number;

    constructor(name: string, minRating: number, maxRating: number) {
        this.name = name;
        this.minRating = minRating;
        this.maxRating = maxRating;
    }
}