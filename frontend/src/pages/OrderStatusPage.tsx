import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { Container, Heading, VStack, Text, Spinner, Alert, Button } from "@chakra-ui/react";
import { fetchOrder } from "../api/client";
import { useSimulatedOrderStatus } from "../hooks/useSimulatedOrderStatus";
import { OrderStepper } from "../components/OrderStepper";
import { Order } from "../types";

const STATUS_LABEL: Record<string, string> = {
  ORDER_RECEIVED: "Order Received",
  PREPARING: "Preparing",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
};

export function OrderStatusPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulated status derived from order.createdAt + elapsed time; falls
  // back to the last fetched value until createdAt is available.
  const simulatedStatus = useSimulatedOrderStatus(order?.createdAt);

  useEffect(() => {
    if (!Number.isInteger(orderId)) {
      setError("Invalid order id");
      setLoading(false);
      return;
    }
    fetchOrder(orderId)
      .then(setOrder)
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <Container py={10}>
        <Spinner />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxW="lg" py={8}>
        <Alert.Root status="error" mb={4}>
          <Alert.Indicator />
          <Alert.Title>{error || "Order not found"}</Alert.Title>
        </Alert.Root>
        <Button asChild>
          <RouterLink to="/">Back to menu</RouterLink>
        </Button>
      </Container>
    );
  }

  const status = simulatedStatus || order.status;

  return (
    <Container maxW="2xl" py={8}>
      <Heading size="lg" mb={2}>
        Order #{order.id}
      </Heading>
      <Text color="gray.600" mb={6}>
        Current status: <strong>{STATUS_LABEL[status]}</strong>
      </Text>

      <OrderStepper status={status} />

      <VStack align="stretch" mt={8} gap={2}>
        <Text fontWeight="bold">Delivery to</Text>
        <Text>{order.customerName}</Text>
        <Text color="gray.600">{order.address}</Text>
        <Text color="gray.600">{order.phone}</Text>
      </VStack>

      <VStack align="stretch" mt={6} gap={1}>
        <Text fontWeight="bold">Items</Text>
        {order.items.map((item) => (
          <Text key={item.id} color="gray.700">
            {item.quantity} x {item.menuItem?.name ?? `Item #${item.menuItemId}`}
          </Text>
        ))}
        <Text fontWeight="bold" mt={2}>
          Total: ${Number(order.totalAmount).toFixed(2)}
        </Text>
      </VStack>

      <Button asChild mt={8}>
        <RouterLink to="/">Order again</RouterLink>
      </Button>
    </Container>
  );
}
