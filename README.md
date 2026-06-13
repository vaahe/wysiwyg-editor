# wysiwyg-editor

A lightweight WYSIWYG editor for React built on the native `contenteditable` API — no heavy dependencies.

**[Live Demo](https://vabster.github.io/wysiwyg-editor)** · **[npm](https://www.npmjs.com/package/@vabster/editor)**

## Packages

| Package                                | Version                                                                                               | Description         |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------- |
| [`@vabster/editor`](./packages/editor) | [![npm](https://img.shields.io/npm/v/@vabster/editor)](https://www.npmjs.com/package/@vabster/editor) | Core editor library |
| [`web`](./apps/web)                    | —                                                                                                     | Demo app (Next.js)  |

## Quick Start

```bash
npm install @vabster/editor
```

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

See the [package README](./packages/editor/README.md) for full API docs.

## Development

This is a pnpm monorepo.

```bash
# Install dependencies
pnpm install

# Run the editor in watch mode
pnpm editor:dev

# Run the demo app
pnpm web:dev

# Build
pnpm web:build
```

## License

ISC
