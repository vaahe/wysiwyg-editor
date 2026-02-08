import type { Command, EditorAdapter, Mark, Block } from "../../types";
import { ToolbarButton } from "../common/ToolbarButton/ToolbarButton";
import { HeadingsDropdown } from "./components";

type ToolbarProps = {
  editor: EditorAdapter | null;
  className?: string;
};

export function Toolbar({ editor, className }: ToolbarProps) {
  const exec = (cmd: Command) => {
    if (!editor) return;
    editor.focus();
    editor.execute(cmd);
  };

  const can = (cmd: Command) => (editor ? editor.canExecute(cmd) : false);

  const activeMark = (m: Mark) => (editor ? editor.isActiveMark(m) : false);
  const activeBlock = (b: Block) => (editor ? editor.isActiveBlock(b) : false);

  return (
    <div
      className={className}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: 8, border: "1px solid #e5e5e5", borderRadius: 12 }}
    >
      <HeadingsDropdown />
      <ToolbarButton
        label="B"
        active={activeMark("bold")}
        disabled={!can({ type: "toggleMark", mark: "bold" })}
        onClick={() => exec({ type: "toggleMark", mark: "bold" })}
      />
      <ToolbarButton
        label="I"
        active={activeMark("italic")}
        disabled={!can({ type: "toggleMark", mark: "italic" })}
        onClick={() => exec({ type: "toggleMark", mark: "italic" })}
      />
      <ToolbarButton
        label="U"
        active={activeMark("underline")}
        disabled={!can({ type: "toggleMark", mark: "underline" })}
        onClick={() => exec({ type: "toggleMark", mark: "underline" })}
      />
      <ToolbarButton
        label="S"
        active={activeMark("strike")}
        disabled={!can({ type: "toggleMark", mark: "strike" })}
        onClick={() => exec({ type: "toggleMark", mark: "strike" })}
      />
      <ToolbarButton
        label="Code"
        active={activeMark("code")}
        disabled={!can({ type: "toggleMark", mark: "code" })}
        onClick={() => exec({ type: "toggleMark", mark: "code" })}
      />

      <div style={{ width: 1, background: "#e5e5e5", margin: "0 4px" }} />

      <ToolbarButton
        label="P"
        active={activeBlock("paragraph")}
        disabled={!can({ type: "setBlock", block: "paragraph" })}
        onClick={() => exec({ type: "setBlock", block: "paragraph" })}
      />
      <ToolbarButton
        label="H1"
        active={activeBlock("heading1")}
        disabled={!can({ type: "setBlock", block: "heading1" })}
        onClick={() => exec({ type: "setBlock", block: "heading1" })}
      />
      <ToolbarButton
        label="H2"
        active={activeBlock("heading2")}
        disabled={!can({ type: "setBlock", block: "heading2" })}
        onClick={() => exec({ type: "setBlock", block: "heading2" })}
      />
      <ToolbarButton
        label="• List"
        active={activeBlock("bulletList")}
        disabled={!can({ type: "setBlock", block: "bulletList" })}
        onClick={() => exec({ type: "setBlock", block: "bulletList" })}
      />
      <ToolbarButton
        label="1. List"
        active={activeBlock("orderedList")}
        disabled={!can({ type: "setBlock", block: "orderedList" })}
        onClick={() => exec({ type: "setBlock", block: "orderedList" })}
      />
      <ToolbarButton
        label="❝"
        active={activeBlock("blockquote")}
        disabled={!can({ type: "setBlock", block: "blockquote" })}
        onClick={() => exec({ type: "setBlock", block: "blockquote" })}
      />

      <div style={{ width: 1, background: "#e5e5e5", margin: "0 4px" }} />

      <ToolbarButton label="Undo" disabled={!can({ type: "undo" })} onClick={() => exec({ type: "undo" })} />
      <ToolbarButton label="Redo" disabled={!can({ type: "redo" })} onClick={() => exec({ type: "redo" })} />
    </div>
  );
}
