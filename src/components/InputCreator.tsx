import React, { useState, useEffect } from "react";
import { FormData, Question } from "../types";
import { useForm } from "../hooks/useForm";
import { Button, Input, Select, Card } from "./common";
import { QUESTION_TYPES } from "../constants";

type InputCreatorProps = {
  createOrUpdateQuestion: (question: FormData) => void;
  editingIndex: number | null;
  questions: Question[];
  cancelEditing: () => void;
};

const InputCreator: React.FC<InputCreatorProps> = React.memo(
  ({ createOrUpdateQuestion, editingIndex, questions, cancelEditing }) => {
    const initialState: FormData = {
      name: "",
      type: "text",
      validation: { required: false, min: "", max: "" },
      options: [],
    };

    const { formData, handleChange, validate, errors, setFormData } = useForm(
      initialState,
      { required: true }
    );
    const [newOption, setNewOption] = useState("");

    useEffect(() => {
      if (editingIndex !== null) {
        setFormData(questions[editingIndex]);
      } else {
        setFormData(initialState);
      }
    }, [editingIndex, questions, setFormData]);

    const handleCreate = () => {
      if (validate()) {
        createOrUpdateQuestion(formData);
        if (editingIndex === null) {
          setFormData(initialState);
        }
      }
    };

    const addOption = () => {
      if (newOption.trim()) {
        setFormData({
          ...formData,
          options: [...formData.options, newOption.trim()],
        });
        setNewOption("");
      }
    };

    const removeOption = (index: number) => {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index),
      });
    };

    return (
      <div className="space-y-4">
        <h3 className="text-xl font-bold">
          {editingIndex !== null ? "Edit Question" : "Create Question"}
        </h3>
        <div className="space-y-2">
          <Input
            type="text"
            label="Question Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
        </div>

        <div className="space-y-2">
          <Select
            id="type"
            name="type"
            value={formData.type}
            label="Question Type"
            options={QUESTION_TYPES}
            onChange={handleChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="required"
            name="required"
            checked={formData.validation.required}
            onChange={(e) =>
              setFormData({
                ...formData,
                validation: {
                  ...formData.validation,
                  required: e.target.checked,
                },
              })
            }
            className="form-checkbox"
          />
          <label htmlFor="required">Required</label>
        </div>

        {formData.type === "number" && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                label=""
                name="min"
                value={formData.validation.min}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validation: { ...formData.validation, min: e.target.value },
                  })
                }
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded"
              />
              <Input
                label=""
                type="number"
                name="max"
                value={formData.validation.max}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    validation: { ...formData.validation, max: e.target.value },
                  })
                }
                placeholder="Max"
              />
            </div>
            {errors.minMax && (
              <p className="text-red-500 text-sm">{errors.minMax}</p>
            )}
          </div>
        )}

        {formData.type === "select" && (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Add option"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <Button onClick={addOption}>Add</Button>
            </div>
            {formData.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{option}</span>
                <Button onClick={() => removeOption(index)} variant={"danger"}>
                  Remove
                </Button>
              </div>
            ))}
            {errors.options && (
              <p className="text-red-500 text-sm">{errors.options}</p>
            )}
          </div>
        )}

        <div className="space-x-2">
          <Button onClick={handleCreate}>
            {editingIndex !== null ? "Update" : "Create"}
          </Button>
          {editingIndex !== null && (
            <Button onClick={cancelEditing}>Cancel</Button>
          )}
        </div>
      </div>
    );
  }
);

export default InputCreator;
