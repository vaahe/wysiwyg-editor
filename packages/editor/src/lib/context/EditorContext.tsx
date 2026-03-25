import { createContext, useContext, type ReactNode } from "react";
import type { Block, Command, EditorAdapter, Mark } from "../../types";

export type EditorContextValue = {
  editor: EditorAdapter | null;
  exec: (command: Command) => void;
  can: (command: Command) => boolean;
  activeMark: (mark: Mark) => boolean;
  activeBlock: (block: Block) => boolean;
};

const EditorContext = createContext<EditorContextValue | null>(null);

export function createEditorContextValue(editor: EditorAdapter | null): EditorContextValue {
  return {
    editor,
    exec: (command) => {
      if (!editor) return;
      editor.focus();
      editor.execute(command);
    },
    can: (command) => (editor ? editor.canExecute(command) : false),
    activeMark: (mark) => (editor ? editor.isActiveMark(mark) : false),
    activeBlock: (block) => (editor ? editor.isActiveBlock(block) : false),
  };
}

type EditorProviderProps = {
  editor: EditorAdapter | null;
  children: ReactNode;
};

export function EditorProvider({ editor, children }: EditorProviderProps) {
  return <EditorContext.Provider value={createEditorContextValue(editor)}>{children}</EditorContext.Provider>;
}

export function useOptionalEditorContext() {
  return useContext(EditorContext);
}

export function useEditorContext() {
  const context = useOptionalEditorContext();

  if (!context) {
    throw new Error("useEditorContext must be used within an EditorProvider.");
  }

  return context;
}
