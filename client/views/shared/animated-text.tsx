import { createContext, memo, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AccessibilityInfo, Platform, type TextProps } from "react-native";
import { AnimatableText } from "../../generated/text-animation.js";

const ReducedMotion = createContext(true);

/** One accessibility subscription for the whole inbox, including virtualized rows. */
export function TextAnimationProvider({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    let current = true;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      current = false;
      setReducedMotion(enabled);
    });
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (current) setReducedMotion(enabled);
    }).catch(() => {
      // Keep motion disabled if the platform cannot read the accessibility setting.
    });
    return () => {
      current = false;
      subscription.remove();
    };
  }, []);
  return <ReducedMotion.Provider value={reducedMotion}>{children}</ReducedMotion.Provider>;
}

const textUpdate = { from: { opacity: 0.35, translateY: 2 }, to: { opacity: 1, translateY: 0 } };

/** Animate updates only: scrolling an unchanged row into view never replays it. */
export const AnimatedText = memo(function AnimatedText({ text, ...props }: Omit<TextProps, "children"> & { text: string }) {
  const element = useRef<AnimatableText>(null);
  const previous = useRef(text);
  const reducedMotion = useContext(ReducedMotion);
  useEffect(() => {
    const changed = previous.current !== text;
    previous.current = text;
    const target = element.current;
    if (!changed || reducedMotion || !target) return;
    void target.animate(textUpdate, 240);
    return () => target.stopAnimation();
  }, [text, reducedMotion]);
  return (
    <AnimatableText
      {...props}
      ref={element}
      useNativeDriver={Platform.OS !== "web"}
      isInteraction={false}
      easing="ease-out"
    >
      {text}
    </AnimatableText>
  );
});
