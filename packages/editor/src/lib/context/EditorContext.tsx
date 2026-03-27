import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Block, Command, EditorAdapter, EditorSnapshot, Mark } from "../../types";

export type EditorContextValue = {
  editor: EditorAdapter | null;
  snapshot: EditorSnapshot;
  exec: (command: Command) => void;
  can: (command: Command) => boolean;
  activeMark: (mark: Mark) => boolean;
  activeBlock: (block: Block) => boolean;
};

const EditorContext = createContext<EditorContextValue | null>(null);

const EMPTY_SNAPSHOT: EditorSnapshot = {
  activeMarks: [],
  activeBlock: null,
  canToggleMarks: [],
  canSetBlocks: [],
  canUndo: false,
  canRedo: false,
};

function canExecute(snapshot: EditorSnapshot, command: Command) {
  if (command.type === "toggleMark") {
    return snapshot.canToggleMarks.includes(command.mark);
  }

  if (command.type === "setBlock") {
    return snapshot.canSetBlocks.includes(command.block);
  }

  if (command.type === "undo") {
    return snapshot.canUndo;
  }

  return snapshot.canRedo;
}

function arraysEqual<T>(left: T[], right: T[]) {
  if (left === right) return true;
  if (left.length !== right.length) return false;

  return left.every((value, index) => value === right[index]);
}

function snapshotsEqual(left: EditorSnapshot, right: EditorSnapshot) {
  return (
    left.activeBlock === right.activeBlock &&
    left.canUndo === right.canUndo &&
    left.canRedo === right.canRedo &&
    arraysEqual(left.activeMarks, right.activeMarks) &&
    arraysEqual(left.canToggleMarks, right.canToggleMarks) &&
    arraysEqual(left.canSetBlocks, right.canSetBlocks)
  );
}

type EditorProviderProps = {
  editor: EditorAdapter | null;
  children: ReactNode;
};

export function EditorProvider({ editor, children }: EditorProviderProps) {
  const cachedSnapshotRef = useRef(EMPTY_SNAPSHOT);

  const subscribe = useCallback(
    (listener: () => void) => (editor ? editor.subscribe(listener) : () => undefined),
    [editor],
  );
  const getSnapshot = useCallback(() => {
    if (!editor) {
      cachedSnapshotRef.current = EMPTY_SNAPSHOT;
      return EMPTY_SNAPSHOT;
    }

    const nextSnapshot = editor.getSnapshot();

    if (snapshotsEqual(cachedSnapshotRef.current, nextSnapshot)) {
      return cachedSnapshotRef.current;
    }

    cachedSnapshotRef.current = nextSnapshot;
    return nextSnapshot;
  }, [editor]);
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_SNAPSHOT);

  const exec = useCallback(
    (command: Command) => {
      if (!editor) return;
      editor.focus();
      editor.execute(command);
    },
    [editor],
  );

  const value = useMemo<EditorContextValue>(
    () => ({
      editor,
      snapshot,
      exec,
      can: (command) => canExecute(snapshot, command),
      activeMark: (mark) => snapshot.activeMarks.includes(mark),
      activeBlock: (block) => snapshot.activeBlock === block,
    }),
    [editor, exec, snapshot],
  );

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
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
