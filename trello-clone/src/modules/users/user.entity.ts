export class User{
    id!: string;
    name!: string;
    email!: string;
    boardId!: string;
    // createdAt!: Date;
    // updatedAt!: Date;

    constructor(data: User) 
    {
        Object.assign(this, data)
    }
}