export class Card {
    id!: string;
    title!: string;
    description!: string;
    position!: number;
    listId!: string;
    dueDate!: string;
    completed!: boolean;
    createdAt!: Date;
    updatedAt!: Date;

    constructor(data: Partial<Card>) {
        Object.assign(this, data);
        if(data.dueDate != null) {
            this.dueDate = new Date(data.dueDate).toLocaleDateString('sv-SE');
        }
    }
}