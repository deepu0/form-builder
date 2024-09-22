import React, { useCallback } from "react";
import { Question } from "../types";
import QuestionCard from "./QuestionCard";
import { useDragAndDrop } from "../hooks/useDragDrop";

type LayoutProps = {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  startEditing: (index: number) => void;
};

const QuestionList: React.FC<LayoutProps> = React.memo(
  ({ questions, setQuestions, startEditing }) => {
    const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop(
      questions,
      setQuestions
    );

    const handleDelete = useCallback(
      (index: number) => {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((_, i) => i !== index)
        );
      },
      [setQuestions]
    );

    return (
      <div>
        <h3 className="text-xl font-bold mb-4">Questions</h3>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              onDelete={() => handleDelete(index)}
              onDragStart={() => handleDragStart(index)}
              onDrop={() => handleDrop(index)}
              onDragOver={handleDragOver}
              onEdit={() => startEditing(index)}
            />
          ))
        ) : (
          <p className="text-gray-500">No questions added yet.</p>
        )}
      </div>
    );
  }
);

export default QuestionList;
