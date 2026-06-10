# @vabster/editor

A lightweight WYSIWYG editor for React built on the native `contenteditable` API — no heavy dependencies.

## Installation

```bash
npm install @vabster/editor
```

## Usage

```tsx
import { Editor, Toolbar } from '@vabster/editor';
import '@vabster/editor/styles.css';

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

| Prop           | Type        | Default | Description                           |
| -------------- | ----------- | ------- | ------------------------------------- |
| `placeholder`  | `string`    | `""`    | Placeholder text when empty           |
| `defaultValue` | `string`    | —       | Initial HTML content to load          |
| `children`     | `ReactNode` | —       | Toolbar, BubbleMenu, or custom UI     |
| `sidebar`      | `ReactNode` | —       | Content rendered in a panel beside it |
| `className`    | `string`    | —       | Extra class on the editor container   |

### `<Toolbar>`

A pre-built toolbar with buttons for marks (bold, italic, underline, strikethrough, code, link), block types (headings, lists, blockquote), alignment, and undo/redo.

### `<BubbleMenu>`

A floating menu that appears when text is selected. Shows mark toggle buttons inline.

### `<ToolbarButton>`

A primitive button styled for use inside a toolbar. Use this to build custom toolbar controls.

```tsx
import { ToolbarButton, useEditorContext } from '@vabster/editor';

function MyBoldButton() {
  const { exec, activeMark } = useEditorContext();
  return (
    <ToolbarButton
      active={activeMark('bold')}
      onClick={() => exec({ type: 'toggleMark', mark: 'bold' })}
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
  snapshot, // full EditorSnapshot — current marks, block, align, etc.
  exec, // (command: Command) => void
  can, // (command: Command) => boolean
  activeMark, // (mark: Mark) => boolean
  activeBlock, // (block: Block) => boolean
  activeAlign, // (align: Align) => boolean
} = useEditorContext();
```

## Commands

Pass a `Command` object to `exec()`:

```ts
exec({ type: 'toggleMark', mark: 'bold' });
exec({ type: 'setBlock', block: 'heading1' });
exec({ type: 'setAlign', align: 'center' });
exec({ type: 'insertImage', src: 'https://…', alt: 'photo' });
exec({ type: 'insertFile', url: 'https://…', name: 'doc.pdf', size: 204800 });
exec({ type: 'undo' });
exec({ type: 'redo' });
```

**Marks:** `bold` | `italic` | `underline` | `strike` | `code` | `link`

**Blocks:** `paragraph` | `heading1`–`heading6` | `bulletList` | `orderedList` | `blockquote`

**Align:** `left` | `center` | `right` | `justify`

## Saving & Rendering Content

The editor stores content as plain HTML, so persisting a post is just storing a string.

### Getting the HTML

**Reactively** with the `useEditorHTML()` hook — updates as the user types:

```tsx
import { Editor, Toolbar, useEditorHTML } from '@vabster/editor';

function SaveButton() {
  const html = useEditorHTML();

  const handleSave = async () => {
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: html }),
    });
  };

  return <button onClick={handleSave}>Save</button>;
}

function PostEditor() {
  return (
    <Editor placeholder="Write your post…">
      <Toolbar />
      <SaveButton />
    </Editor>
  );
}
```

**On demand** with `editor.getHTML()` — no re-renders, read only when you need it:

```tsx
import { useEditorContext } from '@vabster/editor';

function SaveButton() {
  const { editor } = useEditorContext();
  const handleSave = () => savePost(editor?.getHTML() ?? '');
  return <button onClick={handleSave}>Save</button>;
}
```

### Rendering stored content

Display a saved post:

```tsx
<div dangerouslySetInnerHTML={{ __html: post.content }} />
```

Or load it back into the editor for editing via `defaultValue`:

```tsx
<Editor defaultValue={post.content}>
  <Toolbar />
</Editor>
```

> **⚠️ Sanitize before storing or rendering.** HTML from a rich text editor can
> contain malicious markup (e.g. pasted `<script>` tags or `onerror` attributes).
> The editor does not sanitize for you. Run the HTML through a sanitizer such as
> [DOMPurify](https://github.com/cure53/DOMPurify) before persisting or rendering:
>
> ```ts
> import DOMPurify from 'dompurify';
> const clean = DOMPurify.sanitize(html);
> ```

## Custom Adapter

The editor separates the UI from the editing engine via the `EditorAdapter` interface. `NativeAdapter` is the built-in implementation, but you can supply your own (e.g. wrapping ProseMirror or another engine) via `EditorProvider`:

```tsx
import { EditorProvider, NativeAdapter } from '@vabster/editor';

const adapter = new NativeAdapter(domElement);

<EditorProvider editor={adapter}>{/* your custom UI */}</EditorProvider>;
```

## License

ISC
