import { type FC, useState } from "react";
import { useEditorContext } from "../../../../../react-bindings";
import { HeadingOptionList } from "../HeadingOptionList";
import { BubbleMenu } from "../../../BubbleMenu";
import type { Block } from "../../../../../core";

export type HeadingValue = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type HeadingOption = {
  value: HeadingValue;
  label: string;
};

const headingOptions: HeadingOption[] = [
  { value: "p",  label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

const LABEL_BY_VALUE: Record<HeadingValue, string> = {
  p:  "Paragraph",
  h1: "Heading 1",
  h2: "Heading 2",
  h3: "Heading 3",
  h4: "Heading 4",
  h5: "Heading 5",
  h6: "Heading 6",
};

const headingValueByBlock: Partial<Record<Block, HeadingValue>> = {
  paragraph: "p",
  heading1:  "h1",
  heading2:  "h2",
  heading3:  "h3",
  heading4:  "h4",
  heading5:  "h5",
  heading6:  "h6",
};

const blockByHeadingValue: Record<HeadingValue, Block> = {
  p:  "paragraph",
  h1: "heading1",
  h2: "heading2",
  h3: "heading3",
  h4: "heading4",
  h5: "heading5",
  h6: "heading6",
};

type Props = {
  onChange?: (v: HeadingValue) => void;
  options?: HeadingOption[];
};

export const HeadingsDropdown: FC<Props> = ({ onChange, options = headingOptions }) => {
  const { exec, can, snapshot } = useEditorContext();
  const current: HeadingValue = snapshot.activeBlock
    ? (headingValueByBlock[snapshot.activeBlock] ?? "p")
    : "p";

  const disabled = !can({ type: "setBlock", block: "paragraph" });
  const [open, setOpen] = useState(false);

  const handleSelect = (v: HeadingValue) => {
    exec({ type: "setBlock", block: blockByHeadingValue[v] });
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        className={`vb-block-picker-trigger${disabled ? " is-disabled" : ""}${open ? " is-open" : ""}`}
        disabled={disabled}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="vb-block-picker-label">{LABEL_BY_VALUE[current]}</span>
        <svg
          className="vb-block-picker-chevron"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <BubbleMenu open={open} onClose={() => setOpen(false)}>
        <HeadingOptionList options={options} current={current} onSelect={handleSelect} />
      </BubbleMenu>
    </div>
  );
};
