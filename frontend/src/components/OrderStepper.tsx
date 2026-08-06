import { HStack, VStack, Text, Circle, Box } from "@chakra-ui/react";
import { OrderStatus } from "../types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "ORDER_RECEIVED", label: "Order Received" },
  { key: "PREPARING", label: "Preparing" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export function OrderStepper({ status }: { status: OrderStatus }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <HStack gap={0} align="flex-start" w="100%">
      {STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        return (
          <HStack key={step.key} flex={1} align="center">
            <VStack gap={1} flexShrink={0}>
              <Circle
                size="32px"
                bg={isDone ? "orange.500" : "gray.200"}
                color="white"
                fontWeight="bold"
                fontSize="sm"
              >
                {index + 1}
              </Circle>
              <Text fontSize="xs" textAlign="center" color={isDone ? "gray.800" : "gray.400"}>
                {step.label}
              </Text>
            </VStack>
            {index < STEPS.length - 1 && (
              <Box flex={1} h="2px" bg={index < currentIndex ? "orange.500" : "gray.200"} />
            )}
          </HStack>
        );
      })}
    </HStack>
  );
}
