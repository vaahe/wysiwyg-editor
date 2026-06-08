import type { FC, ReactElement } from "react";
import { useEditorContext } from "../../../../../react-bindings";
import type { Align } from "../../../../../core";

const ICONS: Record<Align, ReactElement> = {
  left: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 2h12M1 5h8M1 8h12M1 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  center: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 2h12M3 5h8M1 8h12M3 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  right: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 2h12M5 5h8M1 8h12M5 11h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  justify: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M1 2h12M1 5h12M1 8h12M1 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
};

const ALIGNS: Align[] = ["left", "center", "right", "justify"];
const LABELS: Record<Align, string> = {
  left: "Align left",
  center: "Align center",
  right: "Align right",
  justify: "Justify",
};

export const AlignButtons: FC = () => {
  const { exec, activeAlign, snapshot } = useEditorContext();
  const disabled = snapshot.canSetBlocks.length === 0;

  return (
    <>
      {ALIGNS.map((align) => (
        <button
          key={align}
          type="button"
          aria-label={LABELS[align]}
          aria-pressed={activeAlign(align)}
          disabled={disabled}
          className={`vb-toolbar-btn vb-align-btn${activeAlign(align) ? " is-active" : ""}${disabled ? " is-disabled" : ""}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec({ type: "setAlign", align })}
        >
          {ICONS[align]}
        </button>
      ))}
    </>
  );
};
