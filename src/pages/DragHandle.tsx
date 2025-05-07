import React from 'react';
import { Editor } from '@tiptap/react';
import { Node as ProsemirrorNode } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

interface DragHandleProps {
  editor: Editor;
}

export const DragHandle = ({ editor }: DragHandleProps) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });
  const [currentNode, setCurrentNode] = React.useState<ProsemirrorNode | null>(null);
  const dragHandleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!editor) return;

    const pluginKey = new PluginKey('drag-handle');
    const plugin = new Plugin({
      key: pluginKey,
      view: (_view: EditorView) => ({
        update: (view: EditorView) => {
          const { state } = view;
          const { selection } = state;
          const { $anchor, empty } = selection;

          if (empty || !dragHandleRef.current) {
            setCurrentNode(null);
            return;
          }

          const node = view.state.doc.nodeAt($anchor.pos);
          if (!node) return;

          setCurrentNode(node);

          const start = view.coordsAtPos($anchor.pos);
          const rect = dragHandleRef.current.getBoundingClientRect();
          setPosition({
            top: start.top - rect.height / 2,
            left: start.left - rect.width - 10,
          });
        },
      }),
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin(pluginKey);
    };
  }, [editor]);

  if (!currentNode || !editor.isEditable) return null;

  return (
    <div
      ref={dragHandleRef}
      className={`absolute cursor-move rounded p-1 opacity-70 hover:opacity-100 hover:bg-gray-100 ${
        isDragging ? 'opacity-100 bg-gray-200' : ''
      }`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
      draggable
      onDragStart={() => {
        setIsDragging(true);
        // Set drag data
      }}
      onDragEnd={() => setIsDragging(false)}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 7C8 7.55228 7.55228 8 7 8C6.44772 8 6 7.55228 6 7C6 6.44772 6.44772 6 7 6C7.55228 6 8 6.44772 8 7Z"
          fill="currentColor"
        />
        <path
          d="M8 12C8 12.5523 7.55228 13 7 13C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11C7.55228 11 8 11.4477 8 12Z"
          fill="currentColor"
        />
        <path
          d="M8 17C8 17.5523 7.55228 18 7 18C6.44772 18 6 17.5523 6 17C6 16.4477 6.44772 16 7 16C7.55228 16 8 16.4477 8 17Z"
          fill="currentColor"
        />
        <path
          d="M13 8C13.5523 8 14 7.55228 14 7C14 6.44772 13.5523 6 13 6C12.4477 6 12 6.44772 12 7C12 7.55228 12.4477 8 13 8Z"
          fill="currentColor"
        />
        <path
          d="M13 13C13.5523 13 14 12.5523 14 12C14 11.4477 13.5523 11 13 11C12.4477 11 12 11.4477 12 12C12 12.5523 12.4477 13 13 13Z"
          fill="currentColor"
        />
        <path
          d="M13 18C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16C12.4477 16 12 16.4477 12 17C12 17.5523 12.4477 18 13 18Z"
          fill="currentColor"
        />
        <path
          d="M18 8C18.5523 8 19 7.55228 19 7C19 6.44772 18.5523 6 18 6C17.4477 6 17 6.44772 17 7C17 7.55228 17.4477 8 18 8Z"
          fill="currentColor"
        />
        <path
          d="M18 13C18.5523 13 19 12.5523 19 12C19 11.4477 18.5523 11 18 11C17.4477 11 17 11.4477 17 12C17 12.5523 17.4477 13 18 13Z"
          fill="currentColor"
        />
        <path
          d="M18 18C18.5523 18 19 17.5523 19 17C19 16.4477 18.5523 16 18 16C17.4477 16 17 16.4477 17 17C17 17.5523 17.4477 18 18 18Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};