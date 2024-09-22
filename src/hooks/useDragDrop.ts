import { useState, useCallback } from "react";

export const useDragAndDrop = <T>(
  initialItems: T[],
  setItems: React.Dispatch<React.SetStateAction<T[]>>
) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
  }, []);

  const handleDrop = useCallback(
    (index: number) => {
      if (draggedIndex !== null && draggedIndex !== index) {
        setItems((prevItems) => {
          const updatedItems = Array.from(prevItems);
          const [removed] = updatedItems.splice(draggedIndex, 1);
          updatedItems.splice(index, 0, removed);
          return updatedItems;
        });
      }
      setDraggedIndex(null);
    },
    [draggedIndex, setItems]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  return { handleDragStart, handleDrop, handleDragOver };
};
