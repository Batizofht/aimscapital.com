import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough,
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  Braces,
  RemoveFormatting,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  maxHeight?: string;
  noBorder?: boolean;
}

function EditorToolbar({ editor, onMaximize, isFullscreen, noBorder }: { editor: any; onMaximize: () => void; isFullscreen: boolean; noBorder?: boolean }) {
  const addLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const ToolBtn = ({ onClick, active, title, disabled, children }: { onClick: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded hover:bg-white transition-all ${active ? 'bg-white text-sky-600' : 'text-gray-600'} ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
      title={title}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-gray-200 mx-1 shrink-0" />;

  return (
    <div className={`sticky top-0 z-10 flex flex-wrap items-center gap-1 p-2 ${noBorder ? '' : 'border-b border-gray-100 bg-gray-50'}`}>
      <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolBtn>

      <Divider />

      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></ToolBtn>

      <Divider />

      <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote"><Quote className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block"><Braces className="w-4 h-4" /></ToolBtn>

      <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Add Link"><LinkIcon className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={addImage} title="Add Image"><ImageIcon className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().insertHorizontalRule().run()} title="Horizontal Rule"><Minus className="w-4 h-4" /></ToolBtn>

      <Divider />

      <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting"><RemoveFormatting className="w-4 h-4" /></ToolBtn>

      <Divider />

      <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo"><Undo className="w-4 h-4" /></ToolBtn>
      <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo"><Redo className="w-4 h-4" /></ToolBtn>

      <div className="ml-auto flex items-center">
        <Divider />
        <ToolBtn onClick={onMaximize} title={isFullscreen ? "Minimize" : "Full Screen"}>
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </ToolBtn>
      </div>
    </div>
  );
}

export default function RichTextEditor({ 
  content, 
  onChange, 
  placeholder = "Write something...",
  className = "",
  minHeight,
  maxHeight,
  noBorder = false,
}: RichTextEditorProps) {
  const [fullscreen, setFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-sky-600 underline hover:text-sky-700',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-4 py-3 text-sm text-[#333333]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      {!fullscreen && (
        <div className={`${noBorder ? '' : 'border border-gray-200 rounded-xl focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100'} overflow-hidden transition-all flex flex-col mb-3 ${className}`} style={{ minHeight, maxHeight }}>
          <EditorToolbar editor={editor} onMaximize={() => setFullscreen(true)} isFullscreen={false} noBorder={noBorder} />
          <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
        </div>
      )}

      {fullscreen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col">
          <EditorToolbar editor={editor} onMaximize={() => setFullscreen(false)} isFullscreen={true} />
          <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4">
            <EditorContent editor={editor} />
          </div>
        </div>
      )}
    </>
  );
}
