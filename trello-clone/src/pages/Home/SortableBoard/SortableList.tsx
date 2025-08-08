import { SortableCard } from './SortableCard';
import { AddCard } from './AddCard';
import { List } from '../../../modules/lists/list.entity';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { cardsAtom } from '../../../modules/cards/card.state';
import { useAtomValue } from 'jotai';

interface SortableListProps {
  list: List;
  index: number;
  onDelete: (listId: string) => void;
  onCreateCard: (listId: string, title: string) => Promise<void>;
}

export function SortableList({ list, index, onDelete, onCreateCard }: SortableListProps) {
  const cards = useAtomValue(cardsAtom);
  const sortedListCards = cards.filter((card) => card.listId === list.id).sort((a, b) => a.position - b.position);

  // ID が未定義の場合は DnD コンポーネントを描画しない
  if (!list.id) {
    return null;
  }

  return (
    <Draggable draggableId={String(list.id)} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={{
            ...provided.draggableProps.style,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <div className={`list`}>
              <div
                className="list-header"
                style={{
                  cursor: 'grab',
                }}
                {...provided.dragHandleProps}
              >
              <h3 className="list-title">{list.title}</h3>
              <button className="list-options" onClick={() => onDelete(list.id!)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
            </div>
            <Droppable droppableId={String(list.id)} type="card"> 
              {(provided)=>(
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{
                    minHeight: '1px',
                }}
                >
                  {sortedListCards.map((card, cardIndex) => (
                    <SortableCard key={card.id} card={card} index={cardIndex}/>
                  ))}
                  {provided.placeholder}
              </div>
              )}
            </Droppable>

            <AddCard listId={list.id!} onCreateCard={onCreateCard}/>
          </div>
        </div>
      )}
    </Draggable>
  );
}
