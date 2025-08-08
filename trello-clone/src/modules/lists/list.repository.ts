import api from "../../lib/api";
import { List } from "./list.entity";

export const listRepository = {
    async find(boardId: string): Promise<List[]> {
        const result = await api.get(`/lists/${boardId}`);
        return result.data.map((list: List) => new List(list));
    },
    async createList(boardId: string, title: string): Promise<List> {
        const result = await api.post(`/lists`, { boardId, title });
        return new List(result.data);
    },
    async updateList(lists: List[]): Promise<List[]> {
        const result = await api.put(`/lists`, { lists });
        return result.data.map((list: List) => new List(list));
    },
    async deleteList(listId: string): Promise<boolean> {
        await api.delete(`/lists/${listId}`);
        return true;
    }
}