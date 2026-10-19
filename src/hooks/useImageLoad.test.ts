import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useImageLoad } from "./useImageLoad";

describe("useImageLoad", () => {
  it("starts in loading state when a src is provided", () => {
    const { result } = renderHook(() => useImageLoad("/img/a.webp"));
    expect(result.current.status).toBe("loading");
    expect(result.current.isLoaded).toBe(false);
  });

  it("transitions to loaded on load", () => {
    const { result } = renderHook(() => useImageLoad("/img/a.webp"));
    act(() => result.current.onLoad());
    expect(result.current.status).toBe("loaded");
    expect(result.current.isLoaded).toBe(true);
  });

  it("transitions to error on error", () => {
    const { result } = renderHook(() => useImageLoad("/img/missing.webp"));
    act(() => result.current.onError());
    expect(result.current.status).toBe("error");
    expect(result.current.isError).toBe(true);
  });

  it("resets to loading when src changes", () => {
    const { result, rerender } = renderHook(
      ({ src }) => useImageLoad(src),
      { initialProps: { src: "/img/a.webp" } }
    );
    act(() => result.current.onLoad());
    expect(result.current.status).toBe("loaded");

    rerender({ src: "/img/b.webp" });
    expect(result.current.status).toBe("loading");
  });
});
