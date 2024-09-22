import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "../../hooks/useLocalStorage";

describe("useLocalStorage Hook", () => {
  const localStorageMock = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it("should use the initial value when localStorage is empty", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    expect(result.current[0]).toBe("initialValue");
  });

  it("should use the value from localStorage if it exists", () => {
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify("storedValue"));
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    expect(result.current[0]).toBe("storedValue");
  });

  it("should update the state and localStorage when setValue is called with a value", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    act(() => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify("newValue")
    );
  });

  it("should update the state and localStorage when setValue is called with a function", () => {
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    act(() => {
      result.current[1]((prev) => prev + "Updated");
    });
    expect(result.current[0]).toBe("initialValueUpdated");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify("initialValueUpdated")
    );
  });

  it("should handle errors when reading from localStorage", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    localStorageMock.getItem.mockImplementationOnce(() => {
      throw new Error("getItem error");
    });
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    expect(result.current[0]).toBe("initialValue");
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should handle errors when writing to localStorage", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    localStorageMock.setItem.mockImplementationOnce(() => {
      throw new Error("setItem error");
    });
    const { result } = renderHook(() =>
      useLocalStorage("testKey", "initialValue")
    );
    act(() => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    consoleSpy.mockRestore();
  });

  it("should work with complex objects", () => {
    const complexObject = { a: 1, b: { c: 2 } };
    const { result } = renderHook(() =>
      useLocalStorage("testKey", complexObject)
    );
    expect(result.current[0]).toEqual(complexObject);
    act(() => {
      result.current[1]({ ...complexObject, a: 3 });
    });
    expect(result.current[0]).toEqual({ a: 3, b: { c: 2 } });
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "testKey",
      JSON.stringify({ a: 3, b: { c: 2 } })
    );
  });
});
