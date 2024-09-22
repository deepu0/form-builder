import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useForm } from "../../hooks/useForm";

describe("useForm Hook", () => {
  const initialState: FormData = {
    name: "",
    type: "text",
    validation: { required: false, min: "", max: "" },
    options: [],
  };

  it("should initialize with the given initial state", () => {
    const { result } = renderHook(() => useForm(initialState));
    expect(result.current.formData).toEqual(initialState);
  });

  it("should update form data when handleChange is called", () => {
    const { result } = renderHook(() => useForm(initialState));

    act(() => {
      result.current.handleChange({
        target: { name: "name", value: "Test Question" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.formData.name).toBe("Test Question");
  });

  it("should validate required fields", () => {
    const { result } = renderHook(() =>
      useForm(initialState, { required: true })
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBe("Name is required");
  });

  it("should validate number type min/max", () => {
    const { result } = renderHook(() =>
      useForm({
        ...initialState,
        type: "number",
        validation: { required: false, min: "10", max: "5" },
      })
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.minMax).toBe(
      "Minimum value cannot be greater than maximum value"
    );
  });

  it("should validate select type options", () => {
    const { result } = renderHook(() =>
      useForm({
        ...initialState,
        type: "select",
        options: [],
      })
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.options).toBe(
      "At least one option is required for select type"
    );
  });

  it("should clear errors when setFormData is called", () => {
    const { result } = renderHook(() =>
      useForm(initialState, { required: true })
    );

    act(() => {
      result.current.validate();
    });

    expect(result.current.errors.name).toBe("Name is required");

    act(() => {
      result.current.setFormData({
        ...initialState,
        name: "New Question",
      });
    });

    expect(result.current.errors).toEqual({});
  });

  it("should return true from validate when there are no errors", () => {
    const { result } = renderHook(() =>
      useForm({
        ...initialState,
        name: "Valid Question",
      })
    );

    let isValid: boolean = false;
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(true);
  });

  it("should return false from validate when there are errors", () => {
    const { result } = renderHook(() =>
      useForm(initialState, { required: true })
    );

    let isValid: boolean = true;
    act(() => {
      isValid = result.current.validate();
    });

    expect(isValid).toBe(false);
  });
});
