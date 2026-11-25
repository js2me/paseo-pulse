import type { PluginButtonIconProps } from "@getpaseo/plugin/client";
import { Icon } from "@getpaseo/plugin/client/ui";
import { useEffect, useRef } from "react";
import { View } from "react-native";

const marker = "pulse-switch-shortcut";

/** The composer supplies the originating agent even when several chats are mounted. */
export function SwitchShortcutIcon(props: PluginButtonIconProps & { open(id: string): void }) {
  const ref = useRef<View>(null);
  const agentId = props.context === "agent" ? props.agentId : undefined;
  useEffect(() => {
    const node = ref.current as unknown as HTMLElement | null;
    if (props.layout.platform !== "web" || !node || !agentId) return;
    const doc = node.ownerDocument;
    function keydown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat || event.isComposing || event.altKey ||
        event.ctrlKey === event.metaKey || !event.shiftKey || event.code !== "Space") return;
      // Choose the visible composer closest to keyboard focus, ignoring hidden tab copies.
      const visible = Array.from(doc.querySelectorAll<HTMLElement>(`[data-testid="${marker}"]`))
        .filter(icon => icon.getClientRects().length && !icon.closest('button, [role="button"]')?.closest('[inert], [aria-hidden="true"]'));
      let scope = doc.activeElement;
      while (scope && !visible.some(icon => scope!.contains(icon))) scope = scope.parentElement;
      if (visible.find(icon => scope?.contains(icon)) !== node) return;
      event.preventDefault();
      event.stopPropagation();
      props.open(agentId!);
    }
    doc.addEventListener("keydown", keydown, true);
    return () => doc.removeEventListener("keydown", keydown, true);
  }, [agentId, props.layout.platform, props.open]);
  return <View ref={ref} testID={marker}><Icon name="Inbox" size={props.size} color={props.color} /></View>;
}
