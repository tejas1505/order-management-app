import { useEffect, useRef, useState } from "react";
import { Box, Image, Heading, Text, Button, HStack } from "@chakra-ui/react";
import { MenuItem } from "../types";

interface Props {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export function MenuCard({ item, onAdd }: Props) {
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  function handleAdd() {
    onAdd(item);
    setJustAdded(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), 2000);
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" shadow="sm">
      <Image src={item.imageUrl} alt={item.name} h="160px" w="100%" objectFit="cover" />
      <Box p={4}>
        <Heading size="sm" mb={1}>
          {item.name}
        </Heading>
        <Text fontSize="sm" color="gray.600" mb={3} lineClamp={2}>
          {item.description}
        </Text>
        <HStack justify="space-between">
          <Text fontWeight="bold">${Number(item.price).toFixed(2)}</Text>
          <Button
            size="sm"
            colorPalette={justAdded ? "green" : "orange"}
            onClick={handleAdd}
            minW="112px"
          >
            {justAdded ? "✓ Added" : "Add to cart"}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}
