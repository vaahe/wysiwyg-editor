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
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: 'h3', label: "Heading 3" },
  { value: 'h4', label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

type Props = {
  onChange?: (v: HeadingValue) => void;
  options?: HeadingOption[];
};

const headingValueByBlock: Partial<Record<Block, HeadingValue>> = {
  paragraph: "p",
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  heading4: "h4",
  heading5: "h5",
  heading6: "h6",
};

export const HeadingsDropdown: FC<Props> = ({ onChange, options = headingOptions }) => {
  const { exec, snapshot } = useEditorContext();
  const current = snapshot.activeBlock ? headingValueByBlock[snapshot.activeBlock] ?? "p" : "p";

  const [open, setOpen] = useState(false);

  const handleSelect = (v: HeadingValue) => {
    if (v === "p") exec({ type: "setBlock", block: "paragraph" });
    if (v === "h1") exec({ type: "setBlock", block: "heading1" });
    if (v === "h2") exec({ type: "setBlock", block: "heading2" });
    if (v === "h3") exec({ type: "setBlock", block: "heading3" });
    if (v === "h4") exec({ type: "setBlock", block: "heading4" });
    if (v === "h5") exec({ type: "setBlock", block: "heading5" });
    if (v === "h6") exec({ type: "setBlock", block: "heading6" });
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: "6px 10px",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          background: "white",
          cursor: "pointer",
        }}
      >
        {current.toUpperCase()}
      </button>

      <BubbleMenu open={open} onClose={() => setOpen(false)}>
        <HeadingOptionList options={options} onSelect={handleSelect} />
      </BubbleMenu>
    </div>
  );
};
