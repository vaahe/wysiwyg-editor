'use client';

import { Editor, Toolbar } from "@vabster/editor";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-8 font-sans dark:bg-black">
      <div style={{ width: "100%", maxWidth: 720 }}>
        <Editor placeholder="Start writing…">
          <Toolbar />
        </Editor>
      </div>
    </div>
  );
}
