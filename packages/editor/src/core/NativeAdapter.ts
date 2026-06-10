import type { Align, Block, Command, EditorAdapter, EditorSnapshot, Mark } from './adapter/types';

const BLOCK_TAG: Record<Block, string> = {
  paragraph: 'p',
  heading1: 'h1',
  heading2: 'h2',
  heading3: 'h3',
  heading4: 'h4',
  heading5: 'h5',
  heading6: 'h6',
  bulletList: 'ul',
  orderedList: 'ol',
  blockquote: 'blockquote',
};

const TAG_TO_BLOCK: Record<string, Block> = Object.fromEntries(
  Object.entries(BLOCK_TAG).map(([block, tag]) => [tag, block as Block]),
);

const ALL_MARKS: Mark[] = ['bold', 'italic', 'underline', 'strike', 'code', 'link'];
const ALL_BLOCKS: Block[] = Object.keys(BLOCK_TAG) as Block[];

export class NativeAdapter implements EditorAdapter {
  private el: HTMLElement;
  private listeners: Set<() => void> = new Set();
  private snapshot: EditorSnapshot;
  private rafId: number | null = null;

  constructor(el: HTMLElement) {
    this.el = el;
    this.snapshot = this.buildSnapshot();
    this.el.addEventListener('input', this.scheduleUpdate);
    this.el.addEventListener('keyup', this.scheduleUpdate);
    this.el.addEventListener('mouseup', this.scheduleUpdate);
    document.addEventListener('selectionchange', this.scheduleUpdate);
  }

  destroy() {
    this.el.removeEventListener('input', this.scheduleUpdate);
    this.el.removeEventListener('keyup', this.scheduleUpdate);
    this.el.removeEventListener('mouseup', this.scheduleUpdate);
    document.removeEventListener('selectionchange', this.scheduleUpdate);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.listeners.clear();
  }

  focus() {
    this.el.focus();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getSnapshot(): EditorSnapshot {
    return this.snapshot;
  }

  getHTML(): string {
    return this.el.innerHTML;
  }

  execute(command: Command): void {
    this.el.focus();

    switch (command.type) {
      case 'toggleMark':
        this.toggleMark(command.mark);
        break;
      case 'setBlock':
        this.setBlock(command.block);
        break;
      case 'insertImage':
        this.insertImage(command.src, command.alt);
        break;
      case 'insertFile':
        this.insertFile(command.url, command.name, command.size);
        break;
      case 'setAlign':
        this.setAlign(command.align);
        break;
      case 'undo':
        document.execCommand('undo');
        break;
      case 'redo':
        document.execCommand('redo');
        break;
    }

    this.scheduleUpdate();
  }

  // ── private ────────────────────────────────────────────────────────────────

  private scheduleUpdate = () => {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      const next = this.buildSnapshot();
      if (!snapshotsEqual(this.snapshot, next)) {
        this.snapshot = next;
        this.listeners.forEach((l) => l());
      }
    });
  };

  private toggleMark(mark: Mark): void {
    switch (mark) {
      case 'bold':
        document.execCommand('bold');
        break;
      case 'italic':
        document.execCommand('italic');
        break;
      case 'underline':
        document.execCommand('underline');
        break;
      case 'strike':
        document.execCommand('strikeThrough');
        break;
      case 'code':
        this.toggleCode();
        break;
      case 'link':
        this.toggleLink();
        break;
    }
  }

  private toggleCode(): void {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const parent = range.commonAncestorContainer.parentElement;

    if (parent?.tagName === 'CODE') {
      // unwrap
      const text = document.createTextNode(parent.textContent ?? '');
      parent.replaceWith(text);
    } else {
      const code = document.createElement('code');
      code.appendChild(range.extractContents());
      range.insertNode(code);
      sel.removeAllRanges();
      const newRange = document.createRange();
      newRange.selectNodeContents(code);
      sel.addRange(newRange);
    }
  }

  private toggleLink(): void {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;

    const range = sel.getRangeAt(0);
    const parent = range.commonAncestorContainer.parentElement;

    if (parent?.tagName === 'A') {
      document.execCommand('unlink');
    } else {
      const url = window.prompt('Enter URL:');
      if (url) document.execCommand('createLink', false, url);
    }
  }

  private setBlock(block: Block): void {
    if (block === 'bulletList' || block === 'orderedList') {
      this.toggleList(block);
      return;
    }

    if (block === 'blockquote') {
      this.toggleBlockquote();
      return;
    }

    const tag = BLOCK_TAG[block];
    document.execCommand('formatBlock', false, tag);
  }

  private toggleList(block: 'bulletList' | 'orderedList'): void {
    const cmd = block === 'bulletList' ? 'insertUnorderedList' : 'insertOrderedList';
    document.execCommand(cmd);
  }

  private toggleBlockquote(): void {
    const current = this.getActiveBlock();
    if (current === 'blockquote') {
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand('formatBlock', false, 'blockquote');
    }
  }

  private setAlign(align: Align): void {
    const cmd =
      align === 'left'
        ? 'justifyLeft'
        : align === 'center'
          ? 'justifyCenter'
          : align === 'right'
            ? 'justifyRight'
            : 'justifyFull';
    document.execCommand(cmd);
  }

  private getActiveAlign(): Align {
    if (document.queryCommandState('justifyCenter')) return 'center';
    if (document.queryCommandState('justifyRight')) return 'right';
    if (document.queryCommandState('justifyFull')) return 'justify';
    return 'left';
  }

  private insertAtCursor(node: Node): void {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) {
      this.el.appendChild(node);
      return;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(node);
    range.setStartAfter(node);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  private insertImage(src: string, alt = ''): void {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'vb-image';
    this.insertAtCursor(img);
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  private insertFile(url: string, name: string, size: number): void {
    const chip = document.createElement('a');
    chip.href = url;
    chip.download = name;
    chip.className = 'vb-file-chip';
    chip.contentEditable = 'false';
    chip.innerHTML = `<span class="vb-file-chip-icon" aria-hidden="true">📎</span><span class="vb-file-chip-name">${name}</span><span class="vb-file-chip-size">${this.formatBytes(size)}</span>`;
    this.insertAtCursor(chip);
  }

  private getActiveBlock(): Block | null {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return null;

    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    while (node && node !== this.el) {
      const tag = (node as HTMLElement).tagName?.toLowerCase();
      if (tag && TAG_TO_BLOCK[tag]) return TAG_TO_BLOCK[tag];
      node = (node as HTMLElement).parentElement;
    }

    return null;
  }

  private isMarkActive(mark: Mark): boolean {
    switch (mark) {
      case 'bold':
        return document.queryCommandState('bold');
      case 'italic':
        return document.queryCommandState('italic');
      case 'underline':
        return document.queryCommandState('underline');
      case 'strike':
        return document.queryCommandState('strikeThrough');
      case 'code':
        return this.isInsideTag('CODE');
      case 'link':
        return this.isInsideTag('A');
    }
  }

  private isInsideTag(tagName: string): boolean {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return false;

    let node: Node | null = sel.getRangeAt(0).commonAncestorContainer;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;

    while (node && node !== this.el) {
      if ((node as HTMLElement).tagName === tagName) return true;
      node = (node as HTMLElement).parentElement;
    }

    return false;
  }

  private isSelectionInEditor(): boolean {
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return false;
    return this.el.contains(sel.getRangeAt(0).commonAncestorContainer);
  }

  private buildSnapshot(): EditorSnapshot {
    const inEditor = this.isSelectionInEditor();

    const activeBlock = inEditor ? this.getActiveBlock() : null;
    const activeMarks = inEditor ? ALL_MARKS.filter((m) => this.isMarkActive(m)) : [];

    // marks are available whenever selection is in editor (even collapsed — typing applies marks)
    const canToggleMarks = inEditor ? ALL_MARKS : [];
    // blocks are available whenever selection is in editor
    const canSetBlocks = inEditor ? ALL_BLOCKS : [];

    return {
      activeMarks,
      activeBlock,
      activeAlign: inEditor ? this.getActiveAlign() : 'left',
      canToggleMarks,
      canSetBlocks,
      canUndo: inEditor,
      canRedo: inEditor,
    };
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function snapshotsEqual(a: EditorSnapshot, b: EditorSnapshot): boolean {
  return (
    a.activeBlock === b.activeBlock &&
    a.activeAlign === b.activeAlign &&
    a.canUndo === b.canUndo &&
    a.canRedo === b.canRedo &&
    arraysEqual(a.activeMarks, b.activeMarks) &&
    arraysEqual(a.canToggleMarks, b.canToggleMarks) &&
    arraysEqual(a.canSetBlocks, b.canSetBlocks)
  );
}
