'use client';

import { EditorProvider, Toolbar, type EditorAdapter } from "@vabanik/editor";

const fakeEditor: EditorAdapter = {
  isActiveMark: () => false,
  isActiveBlock: (b) => b === "paragraph",
  canExecute: () => true,
  execute: (cmd) => console.log("exec", cmd),
  focus: () => console.log("focus")
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div style={{ display: "grid", gap: 16 }}>
        <EditorProvider editor={fakeEditor}>
          <Toolbar />
        </EditorProvider>
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
          Editor area placeholder
        </div>
      </div>
    </div>
  );
}
