# @vabster/editor

A lightweight WYSIWYG editor for React built on the native `contenteditable` API — no heavy dependencies.

## Installation

```bash
npm install @vabster/editor
```

## Usage

```tsx
import { Editor, Toolbar } from "@vabster/editor";
import "@vabster/editor/styles.css";

export default function App() {
  return (
    <Editor placeholder="Start writing…">
      <Toolbar />
    </Editor>
  );
}
```

## Components

### `<Editor>`

The root component. Renders a `contenteditable` region and provides editor context to all children.

| Prop          | Type     | Default           | Description                        |
|---------------|----------|-------------------|------------------------------------|
| `placeholder` | `string` | `""`              | Placeholder text when empty        |
| `children`    | `ReactNode` | —              | Toolbar, BubbleMenu, or custom UI  |

### `<Toolbar>`

A pre-built toolbar with buttons for marks (bold, italic, underline, strikethrough, code, link), block types (headings, lists, blockquote), alignment, and undo/redo.

### `<BubbleMenu>`

A floating menu that appears when text is selected. Shows mark toggle buttons inline.

### `<ToolbarButton>`

A primitive button styled for use inside a toolbar. Use this to build custom toolbar controls.

```tsx
import { ToolbarButton, useEditorContext } from "@vabster/editor";

function MyBoldButton() {
  const { exec, activeMark } = useEditorContext();
  return (
    <ToolbarButton
      active={activeMark("bold")}
      onClick={() => exec({ type: "toggleMark", mark: "bold" })}
    >
      B
    </ToolbarButton>
  );
}
```

## Hooks & Context

### `useEditorContext()`

Access the editor state and dispatch commands from any component inside `<Editor>`.

```ts
const {
  snapshot,       // full EditorSnapshot — current marks, block, align, etc.
  exec,           // (command: Command) => void
  can,            // (command: Command) => boolean
  activeMark,     // (mark: Mark) => boolean
  activeBlock,    // (block: Block) => boolean
  activeAlign,    // (align: Align) => boolean
} = useEditorContext();
```

## Commands

Pass a `Command` object to `exec()`:

```ts
exec({ type: "toggleMark", mark: "bold" });
exec({ type: "setBlock", block: "heading1" });
exec({ type: "setAlign", align: "center" });
exec({ type: "insertImage", src: "https://…", alt: "photo" });
exec({ type: "insertFile", url: "https://…", name: "doc.pdf", size: 204800 });
exec({ type: "undo" });
exec({ type: "redo" });
```

**Marks:** `bold` | `italic` | `underline` | `strike` | `code` | `link`

**Blocks:** `paragraph` | `heading1`–`heading6` | `bulletList` | `orderedList` | `blockquote`

**Align:** `left` | `center` | `right` | `justify`

## Custom Adapter

The editor separates the UI from the editing engine via the `EditorAdapter` interface. `NativeAdapter` is the built-in implementation, but you can supply your own (e.g. wrapping ProseMirror or another engine) via `EditorProvider`:

```tsx
import { EditorProvider, NativeAdapter } from "@vabster/editor";

const adapter = new NativeAdapter(domElement);

<EditorProvider editor={adapter}>
  {/* your custom UI */}
</EditorProvider>
```

## License

ISC
