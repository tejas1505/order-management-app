import {
  Drawer,
  Portal,
  Button,
  CloseButton,
  VStack,
  HStack,
  Text,
  NumberInput,
  IconButton,
  Box,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: Props) {
  const { lines, setQuantity, removeItem, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <Drawer.Root open={isOpen} onOpenChange={(d) => !d.open && onClose()} placement="end">
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Your Cart ({totalItems})</Drawer.Title>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
            </Drawer.Header>
            <Drawer.Body>
              {lines.length === 0 ? (
                <Text color="gray.500">Your cart is empty.</Text>
              ) : (
                <VStack align="stretch" gap={4}>
                  {lines.map((line) => (
                    <HStack key={line.menuItem.id} justify="space-between">
                      <Box>
                        <Text fontWeight="medium">{line.menuItem.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          ${Number(line.menuItem.price).toFixed(2)} each
                        </Text>
                      </Box>
                      <HStack>
                        <NumberInput.Root
                          size="sm"
                          maxW="70px"
                          min={1}
                          value={String(line.quantity)}
                          onValueChange={(d) =>
                            setQuantity(line.menuItem.id, Number(d.value) || 1)
                          }
                        >
                          <NumberInput.Input />
                        </NumberInput.Root>
                        <IconButton
                          aria-label="Remove item"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(line.menuItem.id)}
                        >
                          ✕
                        </IconButton>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Drawer.Body>
            <Drawer.Footer>
              <VStack align="stretch" w="100%" gap={3}>
                <HStack justify="space-between">
                  <Text fontWeight="bold">Total</Text>
                  <Text fontWeight="bold">${totalPrice.toFixed(2)}</Text>
                </HStack>
                <Button
                  colorPalette="orange"
                  onClick={handleCheckout}
                  disabled={lines.length === 0}
                >
                  Proceed to checkout
                </Button>
              </VStack>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
