import { createSystem, defaultConfig } from "@chakra-ui/react";

// Chakra UI v3 uses createSystem + defaultConfig instead of extendTheme.
// Keeping this minimal on purpose per "don't over-develop" - just brand color.
export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#fff5f0" },
          500: { value: "#e8590c" },
          600: { value: "#d84c0a" },
        },
      },
    },
  },
});
