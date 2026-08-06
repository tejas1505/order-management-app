import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "../theme/system";
import { MenuCard } from "./MenuCard";
import { MenuItem } from "../types";

const item: MenuItem = {
  id: 1,
  name: "Margherita Pizza",
  description: "Classic pizza with tomato and basil.",
  price: "8.99",
  imageUrl: "https://example.com/pizza.jpg",
};

function renderWithChakra(ui: React.ReactElement) {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
}

describe("MenuCard", () => {
  it("renders the item name, description, and price", () => {
    renderWithChakra(<MenuCard item={item} onAdd={vi.fn()} />);

    expect(screen.getByText("Margherita Pizza")).toBeInTheDocument();
    expect(screen.getByText(/Classic pizza/)).toBeInTheDocument();
    expect(screen.getByText("$8.99")).toBeInTheDocument();
  });

  it("calls onAdd with the item when the button is clicked", () => {
    const onAdd = vi.fn();
    renderWithChakra(<MenuCard item={item} onAdd={onAdd} />);

    fireEvent.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(onAdd).toHaveBeenCalledWith(item);
  });
});
