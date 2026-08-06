import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Alert,
  Button,
  HStack,
  Text,
} from "@chakra-ui/react";
import { MenuCard } from "../components/MenuCard";
import { CartDrawer } from "../components/CartDrawer";
import { fetchMenu } from "../api/client";
import { useCart } from "../context/CartContext";
import { MenuItem } from "../types";

export function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const { addItem, totalItems } = useCart();

  useEffect(() => {
    fetchMenu()
      .then(setItems)
      .catch(() => setError("Could not load the menu. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container maxW="6xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Today's Menu</Heading>
        <Button colorPalette="orange" variant="outline" onClick={() => setCartOpen(true)}>
          Cart ({totalItems})
        </Button>
      </HStack>

      {loading && (
        <HStack justify="center" py={10}>
          <Spinner />
        </HStack>
      )}

      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      {!loading && !error && items.length === 0 && (
        <Text color="gray.500">No menu items available right now.</Text>
      )}

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={6}>
        {items.map((item) => (
          <MenuCard key={item.id} item={item} onAdd={addItem} />
        ))}
      </SimpleGrid>

      <Box position="fixed" bottom={0} left={0} right={0} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </Container>
  );
}
