export type Mark =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "link";

export type Block = "paragraph" | "heading1" | "heading2" | "bulletList" | "orderedList" | "blockquote";

export type Command =
  | { type: "toggleMark"; mark: Mark }
  | { type: "setBlock"; block: Block }
  | { type: "undo" }
  | { type: "redo" };

export interface EditorAdapter {
  isActiveMark(mark: Mark): boolean;
  isActiveBlock(block: Block): boolean;
  canExecute(cmd: Command): boolean;
  execute(cmd: Command): void;
  focus(): void;
}
