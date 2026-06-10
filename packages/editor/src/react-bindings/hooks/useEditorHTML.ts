import { useSyncExternalStore } from 'react';
import { useEditorContext } from '../context';

export function useEditorHTML(): string {
  const { editor } = useEditorContext();

  return useSyncExternalStore(
    (listener) => (editor ? editor.subscribe(listener) : () => undefined),
    () => editor?.getHTML() ?? '',
    () => '',
  );
}
