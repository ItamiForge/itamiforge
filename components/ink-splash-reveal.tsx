"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

type InkSplashRevealProps<T extends ElementType = "span"> = {
  as?: T;
  children: ReactNode;
  className?: string;
  once?: boolean;
  threshold?: number;
  delayMs?: number;
  durationMs?: number;
};

export function InkSplashReveal<T extends ElementType = "span">({
  as,
  children,
  className,
  once = true,
  threshold = 0.2,
  delayMs = 250,
  durationMs = 1100,
}: InkSplashRevealProps<T>) {
  const Comp = (as ?? "span") as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => {
      setReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setActive(true);
      }
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion || !ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setActive(false);
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [once, threshold, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setActive(true);
    }
  }, [reducedMotion]);

  const style = {
    "--ink-delay": `${delayMs}ms`,
    "--ink-duration": `${durationMs}ms`,
  } as CSSProperties;

  return (
    <Comp
      ref={ref}
      className={[
        "ink-reveal",
        active ? "is-active" : "",
        reducedMotion ? "is-reduced" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="ink-reveal__content">{children}</span>
    </Comp>
  );
}
