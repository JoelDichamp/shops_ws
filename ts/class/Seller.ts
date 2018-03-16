export class Seller {

    private first_name: string;
    private last_name: string;

    constructor(first_name: string, last_name: string) {
        this.first_name = first_name;
        this.last_name = last_name;
    }

    getFirst_name(): string {
        return this.first_name;
    }

    getLast_name(): string {
        return this.last_name;
    }

}