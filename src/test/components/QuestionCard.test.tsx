import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QuestionCard from "../../components/QuestionCard";

// Mock the icon components
vi.mock("lucide-react", () => ({
  Hash: () => <div data-testid="icon-hash" />,
  Calendar: () => <div data-testid="icon-calendar" />,
  List: () => <div data-testid="icon-list" />,
  Mail: () => <div data-testid="icon-mail" />,
  Link: () => <div data-testid="icon-link" />,
  AlignLeft: () => <div data-testid="icon-align-left" />,
}));

// Mock the Button component
vi.mock("./Button", () => ({
  default: ({ children, onClick, variant }: any) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
}));

describe("QuestionCard Component", () => {
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDragStart = vi.fn();
  const mockOnDrop = vi.fn();

  const baseProps = {
    onDelete: mockOnDelete,
    onEdit: mockOnEdit,
    onDragStart: mockOnDragStart,
    onDrop: mockOnDrop,
  };



  it("renders select question with options correctly", () => {
    const question = {
      id: "3",
      name: "Select Question",
      type: "select",
      options: ["Option 1", "Option 2"],
    };
    render(<QuestionCard question={question} {...baseProps} />);
    expect(screen.getByText("Select Question")).toBeInTheDocument();
    expect(screen.getByText("Type: select")).toBeInTheDocument();
    expect(screen.getByText("Options: Option 1, Option 2")).toBeInTheDocument();
    expect(screen.getByTestId("icon-list")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const question = { id: "1", name: "Test Question", type: "text" };
    render(<QuestionCard question={question} {...baseProps} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it("calls onEdit when edit button is clicked", () => {
    const question = { id: "1", name: "Test Question", type: "text" };
    render(<QuestionCard question={question} {...baseProps} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it("has correct drag and drop attributes", () => {
    const question = { id: "1", name: "Test Question", type: "text" };
    const { container } = render(
      <QuestionCard question={question} {...baseProps} />
    );
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveAttribute("draggable", "true");
    fireEvent.dragStart(card);
    expect(mockOnDragStart).toHaveBeenCalled();
    fireEvent.drop(card);
    expect(mockOnDrop).toHaveBeenCalled();
  });
});
