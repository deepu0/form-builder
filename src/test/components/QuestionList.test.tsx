import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionList from "../../components/QuestionList";
import { Question } from "../../types";

vi.mock("./QuestionCard", () => ({
  default: ({ question, onDelete, onEdit }: any) => (
    <div data-testid="question-card">
      {question.text}
      <button onClick={onDelete}>Delete</button>
      <button onClick={onEdit}>Edit</button>
    </div>
  ),
}));

vi.mock("../hooks/useDragDrop", () => ({
  useDragAndDrop: () => ({
    handleDragStart: vi.fn(),
    handleDrop: vi.fn(),
    handleDragOver: vi.fn(),
  }),
}));

describe("QuestionList Component", () => {
  const mockQuestions: Question[] = [
    { id: "1", text: "Question 1" },
    { id: "2", text: "Question 2" },
  ];
  const mockSetQuestions = vi.fn();
  const mockStartEditing = vi.fn();

  it("renders without crashing", () => {
    render(
      <QuestionList
        questions={[]}
        setQuestions={mockSetQuestions}
        startEditing={mockStartEditing}
      />
    );
    expect(screen.getByText("Questions")).toBeInTheDocument();
  });

  it('displays "No questions added yet" when there are no questions', () => {
    render(
      <QuestionList
        questions={[]}
        setQuestions={mockSetQuestions}
        startEditing={mockStartEditing}
      />
    );
    expect(screen.getByText("No questions added yet.")).toBeInTheDocument();
  });

  it("calls startEditing when edit button is clicked", () => {
    render(
      <QuestionList
        questions={mockQuestions}
        setQuestions={mockSetQuestions}
        startEditing={mockStartEditing}
      />
    );
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    expect(mockStartEditing).toHaveBeenCalledWith(0);
  });
});
