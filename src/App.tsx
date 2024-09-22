import React, { useState, useEffect, useCallback } from "react";
import { useAutoSave } from "./hooks/useAutoSave";
import QuestionList from "./components/QuestionList";
import InputCreator from "./components/InputCreator";
import { Question } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import FormPreview from "./components/FormPreview";
import { Button } from "./components/common";

const App: React.FC = () => {
  const [questions, setQuestions] = useLocalStorage<Question[]>(
    "questions",
    []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const saving = useAutoSave(questions, async (data: Question[]) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    localStorage.setItem("questions", JSON.stringify(data));
  });

  const createOrUpdateQuestion = useCallback(
    (newQuestion: Question) => {
      setQuestions((prevQuestions) => {
        if (editingIndex !== null) {
          const updatedQuestions = [...prevQuestions];
          updatedQuestions[editingIndex] = newQuestion;
          return updatedQuestions;
        } else {
          return [...prevQuestions, newQuestion];
        }
      });
      setEditingIndex(null);
    },
    [editingIndex, setQuestions]
  );

  const startEditing = useCallback((index: number) => {
    setEditingIndex(index);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingIndex(null);
  }, []);

  const togglePreview = useCallback(() => {
    setShowPreview((prev) => !prev);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 max-w-md p-8 bg-white shadow-lg overflow-auto">
        <QuestionList
          questions={questions}
          setQuestions={setQuestions}
          startEditing={startEditing}
        />
      </div>
      <div className="flex-1 p-8 bg-gray-200 flex flex-col gap-4">
        <InputCreator
          createOrUpdateQuestion={createOrUpdateQuestion}
          editingIndex={editingIndex}
          questions={questions}
          cancelEditing={cancelEditing}
        />
        {saving && <p className="mt-4 text-blue-500">Saving...</p>}
        {questions.length > 0 && (
          <Button onClick={togglePreview}>Preview Form</Button>
        )}
      </div>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <FormPreview
            questions={questions}
            onClose={togglePreview}
            showPreview={showPreview}
          />
        </div>
      )}
    </div>
  );
};

export default App;
