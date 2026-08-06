import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import { MenuItem } from "../types";

const pizza: MenuItem = {
  id: 1,
  name: "Pizza",
  description: "Cheesy",
  price: "10.00",
  imageUrl: "x.jpg",
};

function wrapper({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  it("adds an item to the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(pizza));

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(10);
  });

  it("increments quantity when the same item is added twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(pizza));
    act(() => result.current.addItem(pizza));

    expect(result.current.lines[0].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(20);
  });

  it("removes an item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(pizza));
    act(() => result.current.setQuantity(pizza.id, 0));

    expect(result.current.lines).toHaveLength(0);
  });
});
