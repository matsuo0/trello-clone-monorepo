import { SortableList } from './SortableList';
import { AddList } from './AddList';
import { listRepository } from '../../../modules/lists/list.repository';
import { currentUserAtom } from '../../../modules/auth/current-user.state';
import { useAtomValue } from 'jotai';
import { listsAtom } from '../../../modules/lists/list.state';
import { useAtom } from 'jotai';
import { DragDropContext, Droppable, type DraggableLocation, type DropResult } from '@hello-pangea/dnd';
import { cardRepository } from '../../../modules/cards/card.repository';
import { cardsAtom } from '../../../modules/cards/card.state';
import { Card } from '../../../modules/cards/card.entity';

export default function SortableBoard() {
  const currentUser = useAtomValue(currentUserAtom);
  const [lists, setLists] = useAtom(listsAtom);
  const [cards, setCards] = useAtom(cardsAtom);
  const sortedLists = [...lists].sort((a, b) => a.position - b.position);

  const createCard = async (listId: string, title: string) => {
    try {
      const newCard = await cardRepository.create(listId, title);
      console.log(newCard);
      setCards((prevCards) => [...prevCards, newCard]);
      //setLists((prevLists) => prevLists.map((list) => list.id === listId ? { ...list, cards: [...list.cards, newCard] } : list));
    } catch (error) {
      console.error("カードの作成に失敗しました。", error);
      throw error; // エラーを再スローして、呼び出し元でハンドリングできるようにする
    }
  };

  const createList = async (title: string) => {
    const newList = await listRepository.createList(currentUser!.boardId, title);
    setLists((prevLists) => [...prevLists, newList]); // prevListsはReactの状態更新関数
  };

  const deleteList = async (listId: string) => {
    const confirmedMessage = "リストを削除しますか？このリスト内のカードも全て削除されます";
    try {
      if (window.confirm(confirmedMessage)) {
        await listRepository.deleteList(listId);
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
      }
    } catch (error) {
      console.error("リストの削除に失敗しました。", error);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, type, draggableId } = result;
    console.log('Drag end:', { source, destination, type, draggableId });
    
    if (!destination) return;

    if (type === "list") {
      await handleListMove(source, destination);
    } else if (type === "card") {
      await handleCardMove(draggableId, source, destination);
      //moveCardInSameList(source, destination);
    }
  }

  const handleCardMove = async (cardId: string, source: DraggableLocation, destination: DraggableLocation) => {
    console.log('Card move:', { cardId, source, destination });
    
    const targetCard = cards.find((card) => card.id === cardId);
    if (!targetCard) {
      console.error('Target card not found:', cardId);
      return;
    }

    const originalCards = [...cards];
    try {
      const updateCards = 
        source.droppableId === destination.droppableId ? 
        moveCardInSameList(source, destination) :
        moveCardBetweenLists(source, destination, targetCard);
      console.log('Updated cards:', updateCards);
      setCards(updateCards);
      await cardRepository.update(updateCards);
    } catch (error) {
      setCards(originalCards);
      console.error("カードの移動に失敗しました。", error);
      return;
    }
  }

  const moveCardBetweenLists = (source: DraggableLocation, destination: DraggableLocation, card: Card) => {
    // 元のリストからカードを削除
    const sourceListCards = cards.filter((c) => c.listId === source.droppableId && c.id !== card.id).sort((a, b) => a.position - b.position);
    
    // 移動先のリストのカードを取得
    const destinationListCards = cards.filter((c) => c.listId === destination.droppableId).sort((a, b) => a.position - b.position);
    
    // 移動先のリストにカードを追加
    destinationListCards.splice(destination.index, 0, { ...card, listId: destination.droppableId });
    
    // 全体のカード配列を更新
    const updatedCards = cards.map((c) => {
      // 移動したカードの場合は新しい情報で更新
      if (c.id === card.id) {
        return { ...card, listId: destination.droppableId };
      }
      // 元のリストのカードの位置を更新
      const sourceIndex = sourceListCards.findIndex((sc) => sc.id === c.id);
      if (sourceIndex !== -1) {
        return { ...c, position: sourceIndex };
      }
      // 移動先のリストのカードの位置を更新
      const destIndex = destinationListCards.findIndex((dc) => dc.id === c.id);
      if (destIndex !== -1) {
        return { ...c, position: destIndex };
      }
      return c;
    });
    
    return updatedCards;
  }

  const moveCardInSameList = (source: DraggableLocation, destination: DraggableLocation) => {
    const listCards = cards.filter((card) => card.listId === source.droppableId).sort((a, b) => a.position - b.position);
    const [movedCard] = listCards.splice(source.index, 1);
    listCards.splice(destination.index, 0, movedCard);
    
    return updateCardsPosition(cards, listCards);
  }

  const updateCardsPosition = (cards: Card[], updatedCards: Card[]) => {
    return cards.map((card) => {
      const cardIndex = updatedCards.findIndex((c) => c.id === card.id);
      return cardIndex !== -1 ? { ...card, position: cardIndex } : card;
    })
  }

  const handleListMove = async (source: DraggableLocation, destination: DraggableLocation) => {
    if (!destination) return;

    const [movedList] = sortedLists.splice(source.index, 1);
    sortedLists.splice(destination.index, 0, movedList);
    const updatedLists = sortedLists.map((list, index) => ({
      ...list,
      position: index,
    }));
    
    const originalLists = [...lists];
    setLists(updatedLists);
    try {
      await listRepository.updateList(updatedLists);
    } catch (error) {
      console.error("リストの並び替えに失敗しました。", error);
      setLists(originalLists);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
    <div className="board-container">
      <Droppable droppableId="board" type= "list" direction="horizontal">
        {(provided) =>(
          <div
            style={{ display: 'flex', gap: '12px'}}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {sortedLists.map((list, index) => (
              <SortableList key={list.id} list={list} index={index} onDelete={deleteList} onCreateCard={createCard} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
        <AddList onCreate={createList} />
      </div>
    </DragDropContext>
  );
}
