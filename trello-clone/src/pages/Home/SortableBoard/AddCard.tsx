import { useState } from "react";


interface AddCardProps {
  listId: string;
  onCreateCard: (listId: string, title: string) => Promise<void>;
  }

export function AddCard({ listId, onCreateCard }: AddCardProps) {
  const [showInput, setShowInput] = useState(false);
  const [title, setTitle] = useState("");

  const handleCreateCard = async () => {
    if (title.trim() === "") return;
    try {
      await onCreateCard(listId, title);
      setTitle("");
      setShowInput(false);
    } catch (error) {
      console.error("カードの作成に失敗しました。", error);
      // エラーが発生しても入力フォームは閉じないようにする
      // ユーザーが再試行できるようにする
    }
  };

  if (!showInput) { 
    return <button className="add-card-button" onClick={() => setShowInput(true)} >＋ カードを追加</button>;
  }

  return (
    <div className="add-card-form">
      <textarea
        placeholder="タイトルを入力するか、リンクを貼り付ける"
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="add-card-form-actions">
        <button type="submit" className="add-button" onClick={handleCreateCard}>
          カードを追加
        </button>
        <button type="button" className="cancel-button" onClick={() => setShowInput(false)}>
          ✕
        </button>
      </div>
    </div>
  );
}
