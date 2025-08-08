import { cardRepository } from "../../../modules/cards/card.repository";
import { cardsAtom, selectedCardIdAtom, selectedCardAtom} from "../../../modules/cards/card.state";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import { Card } from "../../../modules/cards/card.entity";
import { useState } from "react";

export const CardModal = () => {
  const [selectedCardId, setSelectedCardId] = useAtom(selectedCardIdAtom);
  const setCards = useSetAtom(cardsAtom);
  const selectedCard = useAtomValue(selectedCardAtom);
  const [title, setTitle] = useState(selectedCard?.title || "");
  const [description, setDescription] = useState(selectedCard?.description || "");
  const [dueDate, setDueDate] = useState(selectedCard?.dueDate || "");
  const [completed, setCompleted] = useState(selectedCard?.completed || false);

  const updateCard = async ()=>{
    try {
      if (!selectedCard) {
        console.error('カードが選択されていません。');
        return;
      }
      const payload = {
        id: selectedCard.id,
        // サーバーで必要な可能性がある既存値は維持
        listId: selectedCard.listId,
        position: selectedCard.position,
        // 変更値
        title,
        description,
        // 空文字は送らない（DBの型がDateのため）
        dueDate: dueDate || undefined,
        completed,
      } as unknown as Card;

      const updatedCards = await cardRepository.update([payload]);
      setCards((prevCards: Card[]) => prevCards.map((c) => c.id === updatedCards[0].id ? updatedCards[0] : c));
      setSelectedCardId(null);
    } catch (error) {
      console.error('カードの更新に失敗しました。', error);
    }
  }

  const deleteCard = async ()=>{
    const confirmMessage= 'カードを削除しますか？この操作は取り消せません。';
    try {
      if (window.confirm(confirmMessage)) {
        await cardRepository.delete(selectedCardId!);
        setCards((prevCards: Card[]) => prevCards.filter((card) => card.id !== selectedCardId));
        setSelectedCardId(null);
      }
    } catch (error) {
      console.error('カードの削除に失敗しました。', error);
    }
  }

  return (
    <div className="card-modal-overlay" onClick={() => setSelectedCardId(null)}>
      <div className="card-modal" onClick={(e) => e.stopPropagation()}>
        <div className="card-modal-header">
          <div className="card-modal-list-info">
            <button className="card-modal-save-button" title="変更を保存" onClick={updateCard}>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                style={{ marginRight: '6px' }}
              >
                <path d="M19 12v7H5v-7M12 3v9m4-4l-4 4-4-4" />
              </svg>
              変更を保存
            </button>
          </div>
          <div className="card-modal-header-actions">
            <button className="card-modal-header-button" title="削除" onClick={deleteCard}>
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>
            <button className="card-modal-close" onClick={() => setSelectedCardId(null)}>×</button>
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="card-modal-title-section">
              <input type="checkbox" className="card-modal-title-checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)}/>
              <textarea
                placeholder="タイトルを入力"
                className="card-modal-title"
                maxLength={50}
                value={title}
                onChange = {(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  期限
                </h3>
              </div>
              <input type="date" className="card-modal-due-date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}/>
            </div>

            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">📝</span>
                  説明
                </h3>
              </div>
              <textarea
                placeholder="説明を入力"
                className="card-modal-description"
                maxLength={200}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
