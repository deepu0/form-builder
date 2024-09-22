import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputCreator from "../../components/InputCreator";

vi.mock("../hooks/useForm", () => ({
  default: () => ({
    formData: {
      name: "",
      type: "text",
      validation: { required: false, min: "", max: "" },
      options: [],
    },
    handleChange: vi.fn(),
    validate: vi.fn(() => true),
    errors: {},
    setFormData: vi.fn(),
  }),
}));

describe("InputCreator Component", () => {
  const mockCreateOrUpdateQuestion = vi.fn();
  const mockCancelEditing = vi.fn();

  const baseProps = {
    createOrUpdateQuestion: mockCreateOrUpdateQuestion,
    editingIndex: null,
    questions: [],
    cancelEditing: mockCancelEditing,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders create mode correctly", () => {
    render(<InputCreator {...baseProps} />);
    expect(screen.getByText("Create Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Question Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Question Type")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
  });

  it("renders edit mode correctly", () => {
    const editingQuestion = {
      id: "1",
      name: "Edited Question",
      type: "text",
      validation: { required: false },
      options: [],
    };
    render(
      <InputCreator
        {...baseProps}
        editingIndex={0}
        questions={[editingQuestion]}
      />
    );
    expect(screen.getByText("Edit Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Question Name")).toHaveValue(
      "Edited Question"
    );
    expect(screen.getByText("Update")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("handles create/update button click", async () => {
    const user = userEvent.setup();
    render(<InputCreator {...baseProps} />);
    await user.type(screen.getByLabelText("Question Name"), "New Question");
    await user.click(screen.getByText("Create"));
    await waitFor(() => {
      expect(mockCreateOrUpdateQuestion).toHaveBeenCalled();
    });
  });

  it("shows number validation fields for number type", async () => {
    const user = userEvent.setup();
    render(<InputCreator {...baseProps} />);
    await user.selectOptions(screen.getByLabelText("Question Type"), "number");
    expect(screen.getByPlaceholderText("Min")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Max")).toBeInTheDocument();
  });

  it("shows option fields for select type", async () => {
    const user = userEvent.setup();
    render(<InputCreator {...baseProps} />);
    await user.selectOptions(screen.getByLabelText("Question Type"), "select");
    expect(screen.getByPlaceholderText("Add option")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("handles adding and removing options for select type", async () => {
    const user = userEvent.setup();
    render(<InputCreator {...baseProps} />);
    await user.selectOptions(screen.getByLabelText("Question Type"), "select");

    await user.type(screen.getByPlaceholderText("Add option"), "New Option");
    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByText("New Option")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));
    expect(screen.queryByText("New Option")).not.toBeInTheDocument();
  });

  it("handles required checkbox", async () => {
    const user = userEvent.setup();
    render(<InputCreator {...baseProps} />);
    await user.click(screen.getByLabelText("Required"));
  });
});
