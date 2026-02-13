// La T representa genéricos, es decir, el tipo de datos que se va a manejar en la página. Puede ser cualquier tipo de dato, como un objeto, un número, una cadena, etc.)
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
}