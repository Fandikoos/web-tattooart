export class PaginatedComponent {

    private page: number = 0;
    private total: number = 0;
    private size: number = 5;

    getPage(): number {
        return this.page;
    }

    getTotal(): number {
        return this.total;
    }

    setTotal(total: number) {
        this.total = total;
    }

    getSize(): number {
        return this.size;
    }

    setPage(page: number) {
        this.page = page;
    }

    setSize(size: number) {
        this.size = size;
    }
}
