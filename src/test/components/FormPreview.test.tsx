import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FormPreview from "../../components/FormPreview";
import { Question } from "../../types";

// Mock the Modal component
vi.mock("./Modal", () => ({
  default: ({ children, isOpen, title }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null,
}));

describe("FormPreview Component", () => {
  const mockQuestions: Question[] = [
    {
      name: "Text Question",
      type: "text",
      validation: { required: true },
    },
    {
      name: "Number Question",
      type: "number",
      validation: { required: false, min: "0", max: "100" },
    },
    {
      name: "Date Question",
      type: "date",
      validation: { required: false },
    },
    {
      name: "Select Question",
      type: "select",
      validation: { required: false },
      options: ["Option 1", "Option 2"],
    },
    {
      name: "Email Question",
      type: "email",
      validation: { required: false },
    },
    {
      name: "URL Question",
      type: "url",
      validation: { required: false },
    },
  ];

  const mockOnClose = vi.fn();

  it("does not render when showPreview is false", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={false}
      />
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders number input correctly", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={true}
      />
    );
    const numberInput = screen.getByLabelText(
      "Number Question"
    ) as HTMLInputElement;
    expect(numberInput).toHaveAttribute("type", "number");
    expect(numberInput).toHaveAttribute("min", "0");
    expect(numberInput).toHaveAttribute("max", "100");
  });

  it("renders date input correctly", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={true}
      />
    );
    const dateInput = screen.getByLabelText(
      "Date Question"
    ) as HTMLInputElement;
    expect(dateInput).toHaveAttribute("type", "date");
  });

  it("renders select input correctly", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={true}
      />
    );
    const selectInput = screen.getByLabelText(
      "Select Question"
    ) as HTMLSelectElement;
    expect(selectInput).toBeInTheDocument();
    expect(screen.getByText("Select an option")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders email input correctly", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={true}
      />
    );
    const emailInput = screen.getByLabelText(
      "Email Question"
    ) as HTMLInputElement;
    expect(emailInput).toHaveAttribute("type", "email");
  });

  it("renders url input correctly", () => {
    render(
      <FormPreview
        questions={mockQuestions}
        onClose={mockOnClose}
        showPreview={true}
      />
    );
    const urlInput = screen.getByLabelText("URL Question") as HTMLInputElement;
    expect(urlInput).toHaveAttribute("type", "url");
  });
});
