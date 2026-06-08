import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NativeAdapter } from '../../core/NativeAdapter';
import { EditorProvider } from '../../react-bindings';

type EditorProps = {
  className?: string;
  defaultValue?: string;
  placeholder?: string;
  children?: ReactNode;
};

export function Editor({ className, defaultValue, placeholder, children }: EditorProps) {
  const elRef = useRef<HTMLDivElement | null>(null);
  const [adapter, setAdapter] = useState<NativeAdapter | null>(null);

  useEffect(() => {
    if (!elRef.current) return;
    const instance = new NativeAdapter(elRef.current);
    setAdapter(instance);
    return () => instance.destroy();
  }, []);

  return (
    <EditorProvider editor={adapter}>
      <div className={`vb-editor${className ? ` ${className}` : ''}`}>
        {children}
        <div
          ref={elRef}
          contentEditable
          suppressContentEditableWarning
          className="vb-editor-content"
          data-placeholder={placeholder ?? 'Start writing…'}
          dangerouslySetInnerHTML={defaultValue ? { __html: defaultValue } : undefined}
        />
      </div>
    </EditorProvider>
  );
}
