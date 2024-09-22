import React from "react";
import { Question } from "../types";
import { Modal } from "./common";

interface FormPreviewProps {
  questions: Question[];
  onClose: () => void;
  showPreview: boolean;
}

const FormPreview: React.FC<FormPreviewProps> = ({
  questions,
  onClose,
  showPreview,
}) => {
  const renderInput = (question: Question) => {
    const baseInputClasses = "w-full p-2 border border-gray-300 rounded-md";
    switch (question.type) {
      case "text":
      case "email":
      case "url":
        return (
          <input
            type={question.type}
            id={question.name}
            className={baseInputClasses}
          />
        );
      case "number":
        return (
          <input
            type="number"
            id={question.name}
            min={question.validation.min}
            max={question.validation.max}
            className={baseInputClasses}
          />
        );
      case "date":
        return (
          <input type="date" id={question.name} className={baseInputClasses} />
        );
      case "select":
        return (
          <select id={question.name} className={baseInputClasses}>
            <option value="">Select an option</option>
            {question.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={showPreview} onClose={onClose} title="Form Preview">
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          <label htmlFor={question.name} className="block font-bold mb-1">
            {question.name}
            {question.validation.required && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </label>
          {renderInput(question)}
        </div>
      ))}
    </Modal>
  );
};

export default FormPreview;
