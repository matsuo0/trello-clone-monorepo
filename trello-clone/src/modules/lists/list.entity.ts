export class List {
    id?: string;
    title!: string;
    position!: number;
    createdAt?: Date;
    updatedAt?: Date;


    constructor(data: List) {
        Object.assign(this, data);
    }
}