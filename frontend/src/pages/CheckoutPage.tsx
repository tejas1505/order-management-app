import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Heading,
  VStack,
  Field,
  Input,
  Button,
  Text,
  HStack,
  Alert,
} from "@chakra-ui/react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/client";

export function CheckoutPage() {
  const { lines, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid =
    customerName.trim().length >= 2 && address.trim().length >= 5 && /^\+?[0-9]{7,15}$/.test(phone.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || lines.length === 0) return;

    setSubmitting(true);
    setError(null);
    try {
      const order = await placeOrder(
        { customerName, address, phone },
        lines.map((l) => ({ menuItemId: l.menuItem.id, quantity: l.quantity }))
      );
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError("Could not place your order. Please check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <Container maxW="lg" py={8}>
        <Text color="gray.500">Your cart is empty. Add items from the menu first.</Text>
        <Button mt={4} onClick={() => navigate("/")}>
          Back to menu
        </Button>
      </Container>
    );
  }

  return (
    <Container maxW="lg" py={8}>
      <Heading size="lg" mb={6}>
        Delivery Details
      </Heading>

      {error && (
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{error}</Alert.Title>
        </Alert.Root>
      )}

      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root required>
            <Field.Label>Full name</Field.Label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Jane Doe"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Delivery address</Field.Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City"
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>Phone number</Field.Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="1234567890"
            />
          </Field.Root>

          <HStack justify="space-between" pt={2}>
            <Text fontWeight="bold">Total</Text>
            <Text fontWeight="bold">${totalPrice.toFixed(2)}</Text>
          </HStack>

          <Button
            type="submit"
            colorPalette="orange"
            loading={submitting}
            disabled={!isValid}
          >
            Place order
          </Button>
        </VStack>
      </form>
    </Container>
  );
}
