import { type FC, useEffect, useRef, useState } from "react";
import { createEditorContextValue, useOptionalEditorContext } from "../../../../lib";
import { HeadingOptionList } from "../HeadingOptionList";
import { BubbleMenu } from "../../../BubbleMenu";
import type { EditorAdapter } from "../../../../types";

export type HeadingValue = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";

export type HeadingOption = {
  value: HeadingValue;
  label: string;
};

const headingOptions: HeadingOption[] = [
  { value: "p", label: "Paragraph" },
  { value: "h1", label: "Heading 1" },
  { value: "h2", label: "Heading 2" },
];

type Props = {
  editor?: EditorAdapter | null;
  value?: HeadingValue;
  defaultValue?: HeadingValue;
  onChange?: (v: HeadingValue) => void;
  options?: HeadingOption[];
};

const resolveHeadingValue = (editor: EditorAdapter | null) => {
  if (!editor) return null;
  if (editor.isActiveBlock("heading1")) return "h1";
  if (editor.isActiveBlock("heading2")) return "h2";
  if (editor.isActiveBlock("paragraph")) return "p";

  return null;
};

export const HeadingsDropdown: FC<Props> = ({
  editor,
  value,
  onChange,
  defaultValue = "h1",
  options = headingOptions,
}) => {
  const context = useOptionalEditorContext();
  const editorState = editor !== undefined ? createEditorContextValue(editor) : context ?? createEditorContextValue(null);
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<HeadingValue>(defaultValue);
  const current = value ?? resolveHeadingValue(editorState.editor) ?? internal;

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
    if (v === "p") editorState.exec({ type: "setBlock", block: "paragraph" });
    if (v === "h1") editorState.exec({ type: "setBlock", block: "heading1" });
    if (v === "h2") editorState.exec({ type: "setBlock", block: "heading2" });
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

      <BubbleMenu open={open} onClose={() => setOpen(false)}>
        <HeadingOptionList options={options} onSelect={handleSelect} />
      </BubbleMenu>
    </div>
  );
};
