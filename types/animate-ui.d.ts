declare module "animate-ui" {
  import { ReactNode } from "react";

  type Theme = "light" | "dark" | "system";
  type ResolvedTheme = "light" | "dark";
  type Direction = "btt" | "ttb" | "ltr" | "rtl";

  interface ThemeTogglerProps {
    direction?: Direction;
    theme?: Theme;
    resolvedTheme?: ResolvedTheme;
    setTheme?: (theme: Theme) => void;
    children?:
      | ReactNode
      | ((state: {
          resolved: ResolvedTheme;
          effective: Theme;
          toggleTheme: (theme: Theme) => void;
        }) => ReactNode);
    onImmediateChange?: (theme: Theme) => void;
    className?: string;
  }

  export function ThemeToggler(props: ThemeTogglerProps): ReactNode;
}
