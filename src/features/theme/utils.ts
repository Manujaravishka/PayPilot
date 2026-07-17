import { Colors } from "../../theme";

export function themeColor(
  color: string | { light: string; dark: string },
  isDark: boolean,
): string {
  if (typeof color === "string") return color;
  return isDark ? color.dark : color.light;
}

export function useThemeColors() {
  return Colors;
}
