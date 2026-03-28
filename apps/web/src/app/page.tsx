'use client';

import { EditorProvider, Toolbar, type EditorAdapter } from "@vabster/editor";

const editor: EditorAdapter = {
  focus: () => console.log("focus"),
  execute: (command) => console.log("exec", command),
  getSnapshot: () => ({
    activeMarks: [],
    activeBlock: "paragraph",
    canToggleMarks: ["bold", "italic", "underline", "strike", "code", "link"],
    canSetBlocks: ["paragraph", "heading1", "heading2", "bulletList", "orderedList", "blockquote"],
    canUndo: true,
    canRedo: true,
  }),
  subscribe: () => () => undefined,
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div style={{ display: "grid", gap: 16 }}>
        <EditorProvider editor={editor}>
          <Toolbar />
        </EditorProvider>
      </div>
    </div>
  );
}
