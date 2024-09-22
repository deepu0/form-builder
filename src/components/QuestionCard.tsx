// QuestionItem.tsx

import React from "react";
import { Question } from "../types";
import { Calendar, Mail, Link, Hash, AlignLeft, List } from "lucide-react";
import { Button, Card } from "./common";

type QuestionItemProps = {
  question: Question;
  onDelete: () => void;
  onEdit: () => void;
  onDragStart: () => void;
  onDrop: () => void;
};

const QuestionCard: React.FC<QuestionItemProps> = React.memo(
  ({ question, onDelete, onEdit, onDragStart, onDrop }) => {
    const getIcon = () => {
      switch (question.type) {
        case "number":
          return <Hash className="text-gray-400" />;
        case "date":
          return <Calendar className="text-gray-400" />;
        case "select":
          return <List className="text-gray-400" />;
        case "email":
          return <Mail className="text-gray-400" />;
        case "url":
          return <Link className="text-gray-400" />;
        default:
          return <AlignLeft className="text-gray-400" />;
      }
    };

    return (
      <div
        className="bg-white p-4 rounded shadow mb-4 cursor-move"
        draggable
        onDragStart={onDragStart}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h4 className="text-lg font-semibold">{question.name}</h4>
        </div>
        <div className="mt-2">
          <p>Type: {question.type}</p>
          {question.validation?.required && <p>Required</p>}
          {question.type === "number" && (
            <>
              {question.validation?.min && (
                <p>Min: {question.validation.min}</p>
              )}
              {question.validation?.max && (
                <p>Max: {question.validation.max}</p>
              )}
            </>
          )}
          {question.type === "select" && (
            <p>Options: {question.options.join(", ")}</p>
          )}
        </div>
        <div className="mt-4 space-x-2">
          <Button onClick={onDelete} variant={"danger"}>
            Delete
          </Button>
          <Button onClick={onEdit} variant={"secondary"}>
            Edit
          </Button>
        </div>
      </div>
    );
  }
);

export default QuestionCard;
