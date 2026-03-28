export type Mark =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "link";

export type Block = "paragraph" | "heading1" | "heading2" | "heading3" | "heading4" | "heading5" | "heading6" | "bulletList" | "orderedList" | "blockquote";

export type Command =
  | { type: "toggleMark"; mark: Mark }
  | { type: "setBlock"; block: Block }
  | { type: "undo" }
  | { type: "redo" };

export type EditorSnapshot = {
  activeMarks: Mark[];
  activeBlock: Block | null;
  canToggleMarks: Mark[];
  canSetBlocks: Block[];
  canUndo: boolean;
  canRedo: boolean;
};

export interface EditorAdapter {
  focus(): void;
  execute(command: Command): void;
  getSnapshot(): EditorSnapshot;
  subscribe(listener: () => void): () => void;
}
