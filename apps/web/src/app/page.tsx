'use client';

import { useState } from 'react';
import { Editor, Toolbar, useEditorHTML } from '@vabster/editor';

const NPM_COMMAND = 'npm install @vabster/editor';

function CopyButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(NPM_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy install command"
      className="ml-2 text-zinc-400 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
    >
      {copied ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8.5l3.5 3.5 6.5-7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  );
}

function HTMLPanel() {
  const html = useEditorHTML();
  return (
    <div className="flex w-full flex-col gap-2 lg:w-80 lg:shrink-0">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">HTML output</p>
      <pre className="min-h-48 overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
        {html || <span className="text-zinc-400">Start typing to see HTML…</span>}
      </pre>
    </div>
  );
}

function EditorSection() {
  return (
    <>
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">Try it out</p>
      <Editor placeholder="Start writing…" sidebar={<HTMLPanel />}>
        <Toolbar />
      </Editor>
    </>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-zinc-900 px-2 py-1 text-xs font-bold text-white dark:bg-white dark:text-zinc-900">
              W
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-white">
              @vabster/editor
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://www.npmjs.com/package/@vabster/editor"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              npm
            </a>
            <a
              href="https://github.com/vaahe/wysiwyg-editor"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Live Demo
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Lightweight WYSIWYG for React
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base text-zinc-500 dark:text-zinc-400">
            Built on the native{' '}
            <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">
              contenteditable
            </code>{' '}
            API. No heavy dependencies, full TypeScript support.
          </p>
          <div className="inline-flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 dark:border-zinc-700 dark:bg-zinc-800">
            <span className="select-none text-zinc-400">$</span>
            <code className="text-sm text-zinc-800 dark:text-zinc-200">{NPM_COMMAND}</code>
            <CopyButton />
          </div>
        </div>
      </section>

      {/* Editor demo */}
      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="w-full max-w-6xl">
          <EditorSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 text-xs text-zinc-400">
          <span>© {new Date().getFullYear()} vabster</span>
          <div className="flex gap-4">
            <a
              href="https://www.npmjs.com/package/@vabster/editor"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              npm
            </a>
            <a
              href="https://github.com/vaahe/wysiwyg-editor"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-900 dark:hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
