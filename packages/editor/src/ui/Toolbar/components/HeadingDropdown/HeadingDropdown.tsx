import { type FC, useEffect, useRef, useState } from "react";
import { HeadingOptionList } from "../HeadingOptionList";
import { BubbleMenu } from "../../../BubbleMenu";

export type HeadingValue = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type HeadingOption = {
  value: HeadingValue;
  label: string;
};

const headingOptions: HeadingOption[] = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
  { value: "h3", label: "Heading 3" },
  { value: "h4", label: "Heading 4" },
  { value: "h5", label: "Heading 5" },
  { value: "h6", label: "Heading 6" },
];

type Props = {
  value?: HeadingValue;
  defaultValue?: HeadingValue;
  onChange?: (v: HeadingValue) => void;
  options?: HeadingOption[];
};

export const HeadingsDropdown: FC<Props> = ({
  value,
  onChange,
  defaultValue = "h1",
}) => {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<HeadingValue>(defaultValue);
  const current = isControlled ? value! : internal;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSelect = (v: HeadingValue) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
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

      <BubbleMenu open={open}>
        <HeadingOptionList options={headingOptions} onSelect={handleSelect} />
      </BubbleMenu>
    </div>
  );
};
