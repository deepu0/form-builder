import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAutoSave } from "../../hooks/useAutoSave";

describe("useAutoSave Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not save immediately when data changes", () => {
    const saveFn = vi.fn(() => Promise.resolve());
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, saveFn, 1000),
      { initialProps: { data: { value: "initial" } } }
    );

    expect(result.current).toBe(false);
    expect(saveFn).not.toHaveBeenCalled();

    rerender({ data: { value: "changed" } });

    expect(result.current).toBe(false);
    expect(saveFn).not.toHaveBeenCalled();
  });

  it("should save after the specified delay", async () => {
    const saveFn = vi.fn(() => Promise.resolve());
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, saveFn, 1000),
      { initialProps: { data: { value: "initial" } } }
    );

    rerender({ data: { value: "changed" } });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(saveFn).toHaveBeenCalledWith({ value: "changed" });
    expect(result.current).toBe(false); // saving should be false after the save is complete
  });

  it("should debounce multiple changes", async () => {
    const saveFn = vi.fn(() => Promise.resolve());
    const { rerender } = renderHook(
      ({ data }) => useAutoSave(data, saveFn, 1000),
      { initialProps: { data: { value: "initial" } } }
    );

    rerender({ data: { value: "change1" } });
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    rerender({ data: { value: "change2" } });
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(saveFn).toHaveBeenCalledTimes(1);
    expect(saveFn).toHaveBeenCalledWith({ value: "change2" });
  });

  it("should set saving to true while saving", async () => {
    const saveFn = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 500))
    );
    const { result, rerender } = renderHook(
      ({ data }) => useAutoSave(data, saveFn, 1000),
      { initialProps: { data: { value: "initial" } } }
    );

    rerender({ data: { value: "changed" } });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe(true); // saving should be true while the save is in progress

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe(false); // saving should be false after the save is complete
  });

  it("should not save if data has not changed", () => {
    const saveFn = vi.fn(() => Promise.resolve());
    const { rerender } = renderHook(
      ({ data }) => useAutoSave(data, saveFn, 1000),
      { initialProps: { data: { value: "initial" } } }
    );

    rerender({ data: { value: "initial" } });

    vi.advanceTimersByTime(1000);

    expect(saveFn).not.toHaveBeenCalled();
  });
});
