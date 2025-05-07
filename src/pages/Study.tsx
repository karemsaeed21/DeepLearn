import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { DragHandle } from './DragHandle';
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  FolderPlus,
  Undo2,
  Sparkles,
  Code,
  CheckSquare,
  Image as ImageIcon,
  Link as LinkIcon,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Strikethrough,
  Underline as UnderlineIcon,
  Highlighter,
} from 'lucide-react';
import { callGeminiAPI, generateAIPrompt } from '../lib/aiUtils';
import { AIModal } from '../components/ai/AIModel';
import 'highlight.js/styles/github-dark.css';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';
// import { Root } from 'lowlight';
import hljs from 'highlight.js/lib/core';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);

interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'summary' | 'study';
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Folder {
  id: string;
  name: string;
  createdAt: Date;
}

const GEMINI_API_KEY = "AIzaSyDP5-ltToP59wrwEXQzX7UWfebYhSL_ZpU";

function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
}

// Register languages with lowlight
lowlight.registerLanguage('javascript', javascript);
lowlight.registerLanguage('typescript', typescript);
lowlight.registerLanguage('python', python);
lowlight.registerLanguage('java', java);
lowlight.registerLanguage('cpp', cpp);
lowlight.registerLanguage('csharp', csharp);
lowlight.registerLanguage('php', php);
lowlight.registerLanguage('ruby', ruby);
lowlight.registerLanguage('go', go);
lowlight.registerLanguage('rust', rust);
lowlight.registerLanguage('sql', sql);
lowlight.registerLanguage('html', html);
lowlight.registerLanguage('css', css);
lowlight.registerLanguage('json', json);
lowlight.registerLanguage('yaml', yaml);
lowlight.registerLanguage('markdown', markdown);

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('learning-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFolders = localStorage.getItem('note-folders');
    return savedFolders ? JSON.parse(savedFolders) : [];
  });

  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteFolder, setNewNoteFolder] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [trashedNotes, setTrashedNotes] = useState<Note[]>(() => {
    const savedTrashed = localStorage.getItem('trashed-notes');
    return savedTrashed ? JSON.parse(savedTrashed) : [];
  });

  const [aiState, setAiState] = useState<{
    type: 'summary' | 'paraphrase' | 'explanation' | null;
    content: string;
    instruction: string;
    isLoading: boolean;
    isError: boolean;
  }>({
    type: null,
    content: '',
    instruction: '',
    isLoading: false,
    isError: false
  });

  // Add this state to track editor initialization
  // const [isEditorReady, setIsEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
        codeBlock: false,
        paragraph: {
          HTMLAttributes: {
            class: 'my-4',
          },
        },
      }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands...',
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'code-block bg-[#0d1117] text-white p-4 rounded-lg overflow-x-auto my-4 border border-gray-700',
        },
        defaultLanguage: 'javascript',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline.configure({
        HTMLAttributes: {
          class: 'underline',
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'highlight',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'link',
        },
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'image',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: '',
    editable: isEditing && activeFolder !== 'trash',
    onUpdate: ({ editor }) => {
      if (activeNote) {
        const content = editor.getHTML();
        debouncedSetActiveNote({
          ...activeNote,
          content: content,
        });
      }
    },
    onCreate: ({ editor }) => {
      editor.setEditable(isEditing && activeFolder !== 'trash');
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (!editor) return false;
        
        // Tab in code block: insert spaces
        if (event.key === 'Tab') {
          const { state } = view;
          const { selection } = state;
          const { $from } = selection;
          const node = $from.node();
          
          if (node.type.name === 'codeBlock') {
            event.preventDefault();
            const tr = state.tr.insertText('  ', selection.from);
            view.dispatch(tr);
            return true;
          }
          
          // Tab in bullet/ordered list: indent (nest)
          if (editor.isActive('bulletList') || editor.isActive('orderedList')) {
            // Let TipTap/ProseMirror handle it (default behavior)
            return false;
          }
          
          // Otherwise, insert tab character
          event.preventDefault();
          const tr = state.tr.insertText('\t', selection.from);
          view.dispatch(tr);
          return true;
        }
        
        if (event.key === 'Enter' && event.shiftKey) {
          editor.chain().focus().setHardBreak().run();
          return true;
        }
        if (event.key === 'Enter' && event.ctrlKey) {
          editor.chain().focus().createParagraphNear().run();
          return true;
        }
        if (event.key === 'Backspace' && event.ctrlKey) {
          editor.chain().focus().deleteNode('paragraph').run();
          return true;
        }
        return false;
      },
    },
  });

  const debouncedSetActiveNote = useDebouncedCallback((updatedNote: Note) => {
    setActiveNote(updatedNote);
  }, 300);

  useEffect(() => {
    localStorage.setItem('learning-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('note-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    const handleNotesUpdated = () => {
      const savedNotes = localStorage.getItem('learning-notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    };

    window.addEventListener('notesUpdated', handleNotesUpdated);
    return () => {
      window.removeEventListener('notesUpdated', handleNotesUpdated);
    };
  }, []);

  // Update content when activeNote changes
  useEffect(() => {
    if (editor && activeNote) {
      editor.commands.setContent(activeNote.content || '');
    }
  }, [activeNote?.id, editor]);

  // Handle editing state
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing && activeFolder !== 'trash');
    }
  }, [isEditing, editor, activeFolder]);

  useEffect(() => {
    localStorage.setItem('trashed-notes', JSON.stringify(trashedNotes));
  }, [trashedNotes]);

  // Add keyboard shortcuts for common actions
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case 'u':
            event.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
          case 'k':
            event.preventDefault();
            const url = window.prompt('Enter URL:');
            if (url) {
              editor.chain().focus().toggleLink({ href: url }).run();
            }
            break;
          case 'z':
            event.preventDefault();
            if (event.shiftKey) {
              editor.chain().focus().redo().run();
            } else {
              editor.chain().focus().undo().run();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  const createNewNote = () => {
    if (newNoteFolder && !folders.find((folder) => folder.id === newNoteFolder)) {
      alert('The selected folder does not exist.');
      return;
    }
    const newNote: Note = {
      id: Date.now().toString(),
      title: newNoteTitle || 'Untitled Note',
      content: newNoteContent || '',
      type: 'note',
      folder: newNoteFolder || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setActiveNote(newNote);
    setIsEditing(true);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteFolder(null);
    setShowNewNoteModal(false);
  };

  const createNewFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: newFolderName,
        createdAt: new Date(),
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderDialog(false);
    } else {
      alert('Folder name cannot be empty');
    }
  };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note
    );
    setNotes(updatedNotes);
    setActiveNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    const noteToTrash = notes.find((note) => note.id === noteId);
    if (noteToTrash) {
      setTrashedNotes([noteToTrash, ...trashedNotes]);
      setNotes(notes.filter((note) => note.id !== noteId));
      if (activeNote?.id === noteId) {
        setActiveNote(null);
        setIsEditing(false);
        if (editor) {
          editor.commands.setContent('');
        }
      }
    }
  };

  const deleteFolder = (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder? This will also move its notes to trash.')) {
      const notesInFolder = notes.filter(note => note.folder === folderId);
      setTrashedNotes(prevTrashed => [...prevTrashed, ...notesInFolder]);
      setNotes(prevNotes => prevNotes.filter(note => note.folder !== folderId));
      setFolders(folders.filter((folder) => folder.id !== folderId));
      if (activeFolder === folderId) {
        setActiveFolder(null);
      }
    }
  };

  const filteredNotes = activeFolder === 'trash'
    ? trashedNotes
    : activeFolder
      ? notes.filter((note) => note.folder === activeFolder)
      : notes.filter((note) => !note.folder);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, folderId: string | null) => {
    e.preventDefault();
    const draggedNoteId = e.dataTransfer.getData('text/plain');
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === draggedNoteId ? { ...note, folder: folderId || undefined } : note
      )
    );
  };

  const updateFolderName = (folderId: string) => {
    if (editingFolderName.trim()) {
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId ? { ...folder, name: editingFolderName } : folder
        )
      );
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const handleAIAction = async (type: 'summary' | 'paraphrase' | 'explanation') => {
    let textToProcess = '';
    if (editor) {
      const selection = editor.state.selection;
      textToProcess = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
      if (!textToProcess.trim()) textToProcess = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
    }
    
    if (!textToProcess.trim()) {
      setAiState({
        type,
        content: "Please select text or add content to process.",
        instruction: '',
        isLoading: false,
        isError: true
      });
      return;
    }

    setAiState(prev => ({
      ...prev,
      type,
      content: '',
      instruction: '',
      isLoading: true,
      isError: false
    }));

    const prompt = generateAIPrompt(type, textToProcess);
    
    await callGeminiAPI(
      prompt,
      GEMINI_API_KEY,
      (content: any) => {
        setAiState(prev => ({
          ...prev,
          content: prev.content + content
        }));
      },
      (error: any) => {
        setAiState(prev => ({
          ...prev,
          content: error,
          isError: true
        }));
      },
      () => {
        setAiState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    );
  };

  const handleAIRefine = async () => {
    if (!aiState.instruction.trim() || !aiState.type) return;

    let textToProcess = '';
    if (editor) {
      const selection = editor.state.selection;
      textToProcess = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
      if (!textToProcess.trim()) textToProcess = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
    }

    if (!textToProcess.trim()) {
      setAiState(prev => ({
        ...prev,
        content: "No text to process.",
        isError: true
      }));
      return;
    }

    setAiState(prev => ({
      ...prev,
      content: '',
      isLoading: true,
      isError: false
    }));

    const prompt = generateAIPrompt(aiState.type, textToProcess, aiState.instruction);
    
    await callGeminiAPI(
      prompt,
      GEMINI_API_KEY,
      (content: any) => {
        setAiState(prev => ({
          ...prev,
          content: prev.content + content
        }));
      },
      (error: any) => {
        setAiState(prev => ({
          ...prev,
          content: error,
          isError: true
        }));
      },
      () => {
        setAiState(prev => ({
          ...prev,
          isLoading: false,
          instruction: ''
        }));
      }
    );
  };

  const handleAIInsert = () => {
    if (!editor || !aiState.content || aiState.isError || !aiState.type) return;

    const { from, to } = editor.state.selection;
    const formattedContent = `<div class="ai-${aiState.type}"><h3>${aiState.type.charAt(0).toUpperCase() + aiState.type.slice(1)}</h3>${aiState.content}</div>`;
    
    if (from !== to) {
      editor.commands.insertContentAt({ from, to }, formattedContent);
    } else {
      editor.commands.insertContent(formattedContent);
    }
    
    setAiState({
      type: null,
      content: '',
      instruction: '',
      isLoading: false,
      isError: false
    });
  };

  const handleAIReplace = () => {
    if (!editor || !aiState.content || aiState.isError || !aiState.type) return;

    editor.commands.setContent(`<h1>${activeNote?.title || aiState.type.charAt(0).toUpperCase() + aiState.type.slice(1)}</h1>${aiState.content}`);
    
    setAiState({
      type: null,
      content: '',
      instruction: '',
      isLoading: false,
      isError: false
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (editor) {
          editor.chain().focus().setImage({ src }).run();
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const EditorMenuBar: React.FC<{ editor: any }> = ({ editor }) => {
    if (!editor) return null;

    const handleButtonClick = (command: () => void) => {
      command();
    };

    return (
      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleBold().run())} 
              className={`p-1.5 ${editor.isActive('bold') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleItalic().run())} 
              className={`p-1.5 ${editor.isActive('italic') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleUnderline().run())} 
              className={`p-1.5 ${editor.isActive('underline') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleStrike().run())} 
              className={`p-1.5 ${editor.isActive('strike') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Strikethrough className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleHighlight().run())} 
              className={`p-1.5 ${editor.isActive('highlight') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Highlighter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} 
              className={`p-1.5 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} 
              className={`p-1.5 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} 
              className={`p-1.5 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heading3 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                console.log('Bullet list active:', editor.isActive('bulletList')); // Debug log
              }} 
              className={`p-1.5 ${editor.isActive('bulletList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                console.log('Ordered list active:', editor.isActive('orderedList')); // Debug log
              }} 
              className={`p-1.5 ${editor.isActive('orderedList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                editor.chain().focus().toggleTaskList().run();
                console.log('Task list active:', editor.isActive('taskList')); // Debug log
              }} 
              className={`p-1.5 ${editor.isActive('taskList') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1 border-r border-gray-200 pr-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleBlockquote().run())} 
              className={`p-1.5 ${editor.isActive('blockquote') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().toggleCodeBlock().run())} 
              className={`p-1.5 ${editor.isActive('codeBlock') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().setTextAlign('left').run())} 
              className={`p-1.5 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().setTextAlign('center').run())} 
              className={`p-1.5 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().setTextAlign('right').run())} 
              className={`p-1.5 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => handleButtonClick(() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run())} 
              className={`p-1.5 ${editor.isActive('table') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <TableIcon className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              className={`p-1.5 ${editor.isActive('image') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                const url = prompt('Enter URL');
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }} 
              className={`p-1.5 ${editor.isActive('link') ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const processContentWithHighlighting = (content: string) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');

      // Highlight all code blocks
      doc.querySelectorAll('pre code').forEach((block) => {
        const codeElement = block as HTMLElement;
        const codeText = codeElement.textContent || '';
        let language = 'plaintext';

        // Try to extract language from class
        const match = codeElement.className.match(/language-([a-zA-Z0-9]+)/);
        if (match) language = match[1];

        try {
          // Use highlight.js to highlight code
          const result = hljs.highlight(codeText, { language, ignoreIllegals: true });
          codeElement.innerHTML = result.value;
          codeElement.className = `hljs language-${language}`;
        } catch (e) {
          // Fallback: show raw code
          codeElement.textContent = codeText;
          codeElement.className = `hljs language-${language}`;
        }
        // Always ensure parent <pre> has code block styling
        if (codeElement.parentElement) {
          codeElement.parentElement.className = 'code-block bg-[#0d1117] text-white p-4 rounded-lg overflow-x-auto my-4 border border-gray-700';
        }
      });

      return doc.body.innerHTML;
    } catch (error) {
      console.error('Error processing content:', error);
      return content;
    }
  };

  // Update the note selection handler
  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    setIsEditing(false);
    // Force content update when selecting a note
    if (editor) {
      editor.commands.setContent(note.content || '');
    }
  };

  // Update the edit button handler
  const handleEditClick = () => {
    if (activeNote && editor) {
      setIsEditing(true);
      editor.commands.setContent(activeNote.content || '');
    }
  };

  // Add handlers for trash actions
  const handleRestoreNote = (noteId: string) => {
    const note = trashedNotes.find(n => n.id === noteId);
    if (note) {
      setNotes([note, ...notes]);
      setTrashedNotes(trashedNotes.filter(n => n.id !== noteId));
      // Always clear the view after restoring
      setActiveNote(null);
      setIsEditing(false);
      if (editor) {
        editor.commands.setContent('');
      }
    }
  };

  const handleDeleteForever = (noteId: string) => {
    const note = trashedNotes.find(n => n.id === noteId);
    if (note && confirm('Are you sure you want to permanently delete this note?')) {
      setTrashedNotes(trashedNotes.filter(n => n.id !== noteId));
      if (activeNote?.id === noteId) {
        setActiveNote(null);
        setIsEditing(false);
        if (editor) {
          editor.commands.setContent('');
        }
      }
    }
  };

  // const handleDeleteNote = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.stopPropagation();
  //   const noteId = e.currentTarget.dataset.noteId;
  //   if (noteId) {
  //     deleteNote(noteId);
  //   }
  // };

  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
          <p className="mt-2 text-gray-600">Organize your learning materials, summaries, and study notes.</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-3 mb-6">
              <Button variant="primary" onClick={() => { setNewNoteFolder(activeFolder); setShowNewNoteModal(true); }} className="w-full flex items-center justify-center"><Plus className="h-4 w-4 mr-2" />New Note</Button>
              <Button variant="outline" onClick={() => setShowNewFolderDialog(true)} className="w-full flex items-center justify-center"><FolderPlus className="h-4 w-4 mr-2" />New Folder</Button>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Folders</h3>
              <div className="space-y-2">
                <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, null)} className="p-2 rounded-lg hover:bg-gray-50">
                  <button onClick={() => setActiveFolder(null)} className={`w-full text-left px-3 py-2 rounded-lg ${activeFolder === null ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>All Notes</button>
                </div>
                <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, 'trash')} className="p-2 rounded-lg hover:bg-gray-50">
                  <button onClick={() => setActiveFolder('trash')} className={`w-full text-left px-3 py-2 rounded-lg ${activeFolder === 'trash' ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'}`}>🗑️ Trash</button>
                </div>
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center justify-between" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, folder.id)}>
                    {editingFolderId === folder.id ? (
                      <div className="flex-1 flex items-center">
                        <input type="text" value={editingFolderName} onChange={(e) => setEditingFolderName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') updateFolderName(folder.id); if (e.key === 'Escape') { setEditingFolderId(null); setEditingFolderName(''); } }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" autoFocus />
                        <button onClick={() => updateFolderName(folder.id)} className="ml-2 text-green-500 hover:text-green-600"><Save className="h-4 w-4" /></button>
                        <button onClick={() => { setEditingFolderId(null); setEditingFolderName(''); }} className="ml-2 text-red-500 hover:text-red-600"><X className="h-4 w-4" /></button>
                      </div>
                    ) : (
                      <>
                        <button onClick={() => setActiveFolder(folder.id)} className={`flex-1 text-left px-3 py-2 rounded-lg ${activeFolder === folder.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'}`}>{folder.name}</button>
                        <div className="flex items-center">
                          <button onClick={() => { setEditingFolderId(folder.id); setEditingFolderName(folder.name); }} className="text-gray-400 hover:text-blue-500 ml-2"><Edit2 className="h-4 w-4" /></button>
                          <button onClick={() => deleteFolder(folder.id)} className="text-gray-400 hover:text-red-500 ml-2"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <motion.div key={note.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <div draggable={activeFolder !== 'trash'} onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, note.id)}>
                    <Card 
                      hoverable 
                      className={`p-4 cursor-pointer relative ${activeNote?.id === note.id ? 'border-indigo-500 bg-indigo-50' : ''}`} 
                      onClick={() => handleNoteSelect(note)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{note.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
                        </div>
                        {activeFolder !== 'trash' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete" 
                            onClick={() => deleteNote(note.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      {activeFolder === 'trash' && (
                        <div className="flex items-center gap-1 absolute top-2 right-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Restore" 
                            onClick={() => handleRestoreNote(note.id)}
                            className="text-green-600 hover:bg-green-100"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete Forever" 
                            onClick={() => handleDeleteForever(note.id)}
                            className="text-red-600 hover:bg-red-100"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                </motion.div>
              ))}
              {filteredNotes.length === 0 && (<div className="text-center py-8 text-gray-500">No notes in this {activeFolder === 'trash' ? 'trash' : activeFolder ? 'folder' : 'view'}.</div>)}
            </div>
          </div>

          {/* Note Editor */}
          <div className="lg:w-3/4">
            {activeNote && notes.find(n => n.id === activeNote.id) ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{activeNote.title}</h2>
                  <div className="flex gap-2">
                    {!isEditing && activeFolder !== 'trash' && (
                      <Button 
                        variant="outline" 
                        onClick={handleEditClick} 
                        className="flex items-center"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />Edit
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      title="Close" 
                      onClick={() => { 
                        setActiveNote(null); 
                        setIsEditing(false); 
                        if (editor) {
                          editor.commands.setContent('');
                        }
                      }} 
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {isEditing && activeFolder !== 'trash' ? (
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={activeNote?.title || ''} 
                      onChange={(e) => setActiveNote(prev => prev ? { ...prev, title: e.target.value } : null)} 
                      className="w-full text-xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-500" 
                      placeholder="Note Title" 
                    />
                    <EditorMenuBar editor={editor} />
                    {!editor ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <style>
                          {`
                            .prose h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0; }
                            .prose h2 { font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0; }
                            .prose h3 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
                            .prose h4 { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
                            .prose h5 { font-size: 1rem; font-weight: 600; margin: 0.25rem 0; }
                            .prose h6 { font-size: 0.875rem; font-weight: 600; margin: 0.25rem 0; }
                          `}
                        </style>
                        <EditorContent
                          editor={editor}
                          className="w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg focus:outline-none p-4 transition-shadow focus:ring-2 focus:ring-indigo-200 overflow-y-auto prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none
                            [&_.ProseMirror]:min-h-[300px]
                            [&_.ProseMirror]:outline-none
                            [&_.ProseMirror]:overflow-y-auto
                            [&_.ProseMirror]:scrollbar-thin
                            [&_.ProseMirror]:scrollbar-thumb-gray-300
                            [&_.ProseMirror]:scrollbar-track-transparent
                            [&_.ProseMirror_p]:my-2
                            [&_.ProseMirror_h1]:text-3xl
                            [&_.ProseMirror_h1]:font-bold
                            [&_.ProseMirror_h1]:my-4
                            [&_.ProseMirror_h2]:text-2xl
                            [&_.ProseMirror_h2]:font-bold
                            [&_.ProseMirror_h2]:my-3
                            [&_.ProseMirror_h3]:text-xl
                            [&_.ProseMirror_h3]:font-bold
                            [&_.ProseMirror_h3]:my-2
                            [&_.ProseMirror_ul]:my-2
                            [&_.ProseMirror_ol]:my-2
                            [&_.ProseMirror_li]:my-1
                            [&_.ProseMirror_blockquote]:border-l-4
                            [&_.ProseMirror_blockquote]:border-gray-300
                            [&_.ProseMirror_blockquote]:pl-4
                            [&_.ProseMirror_blockquote]:italic
                            [&_.ProseMirror_code]:bg-gray-100
                            [&_.ProseMirror_code]:px-1
                            [&_.ProseMirror_code]:py-0.5
                            [&_.ProseMirror_code]:rounded
                            [&_.ProseMirror_pre]:bg-[#0d1117]
                            [&_.ProseMirror_pre]:text-white
                            [&_.ProseMirror_pre]:p-4
                            [&_.ProseMirror_pre]:rounded-lg
                            [&_.ProseMirror_pre]:overflow-x-auto
                            [&_.ProseMirror_pre]:my-4
                            [&_.ProseMirror_pre]:border
                            [&_.ProseMirror_pre]:border-gray-700
                            [&_.ProseMirror_pre_code]:text-sm
                            [&_.ProseMirror_pre_code]:font-mono
                            [&_.ProseMirror_pre_code]:block
                            [&_.ProseMirror_pre_code]:overflow-x-auto
                            [&_.ProseMirror_pre_code]:whitespace-pre
                            [&_.ProseMirror_pre_code]:p-0
                            [&_.ProseMirror_pre_code]:bg-transparent
                            [&_.ProseMirror_pre_code]:text-inherit
                            [&_.ProseMirror_pre_code]:border-0
                            [&_.ProseMirror_pre_code]:rounded-none
                            [&_.ProseMirror_pre_code]:shadow-none
                            [&_.ProseMirror_pre_code]:before:content-none
                            [&_.ProseMirror_pre_code]:after:content-none
                            [&_.ProseMirror_pre_code_.hljs-keyword]:text-[#ff7b72]
                            [&_.ProseMirror_pre_code_.hljs-string]:text-[#a5d6ff]
                            [&_.ProseMirror_pre_code_.hljs-number]:text-[#79c0ff]
                            [&_.ProseMirror_pre_code_.hljs-function]:text-[#d2a8ff]
                            [&_.ProseMirror_pre_code_.hljs-comment]:text-[#8b949e]
                            [&_.ProseMirror_pre_code_.hljs-attr]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-selector-tag]:text-[#ff7b72]
                            [&_.ProseMirror_pre_code_.hljs-selector-class]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-selector-id]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-selector-attr]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-selector-pseudo]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-attribute]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-variable]:text-[#ffa657]
                            [&_.ProseMirror_pre_code_.hljs-template-variable]:text-[#ffa657]
                            [&_.ProseMirror_pre_code_.hljs-regexp]:text-[#ff7b72]
                            [&_.ProseMirror_pre_code_.hljs-link]:text-[#a5d6ff]
                            [&_.ProseMirror_pre_code_.hljs-symbol]:text-[#ffa657]
                            [&_.ProseMirror_pre_code_.hljs-bullet]:text-[#ffa657]
                            [&_.ProseMirror_pre_code_.hljs-built_in]:text-[#ffa657]
                            [&_.ProseMirror_pre_code_.hljs-addition]:text-[#7ee787]
                            [&_.ProseMirror_pre_code_.hljs-deletion]:text-[#ff7b72]
                            [&_.ProseMirror_pre_code_.hljs-emphasis]:italic
                            [&_.ProseMirror_pre_code_.hljs-strong]:font-bold
                            [&_.ProseMirror_task-list]:my-2
                            [&_.ProseMirror_task-item]:flex
                            [&_.ProseMirror_task-item]:gap-2
                            [&_.ProseMirror_task-item]:items-start
                            [&_.ProseMirror_task-item]:my-1
                            [&_.ProseMirror_task-item_input]:mt-1.5
                            [&_.ProseMirror_highlight]:bg-yellow-200
                            [&_.ProseMirror_underline]:underline
                            [&_.ProseMirror_strike]:line-through
                            [&_.ProseMirror_placeholder]:text-gray-400
                            [&_.ProseMirror_placeholder]:pointer-events-none
                            [&_.ProseMirror_placeholder]:select-none
                            [&_.ProseMirror_placeholder]:absolute
                            [&_.ProseMirror_placeholder]:top-0
                            [&_.ProseMirror_placeholder]:left-0
                            [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-gray-300 [&_.ProseMirror_table]:bg-white
                            [&_.ProseMirror_table_cell]:border [&_.ProseMirror_table_cell]:border-gray-300 [&_.ProseMirror_table_cell]:bg-white [&_.ProseMirror_table_cell]:p-2
                            [&_.ProseMirror_table_header]:border [&_.ProseMirror_table_header]:border-gray-300 [&_.ProseMirror_table_header]:bg-gray-100 [&_.ProseMirror_table_header]:p-2" 
                        />
                        {editor && <DragHandle editor={editor} />}
                      </div>
                    )}
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => { setIsEditing(false); if (editor && activeNote) editor.commands.setContent(notes.find(n => n.id === activeNote.id)?.content || activeNote.content); }} className="flex items-center"><X className="h-4 w-4 mr-2" />Cancel</Button>
                      <Button variant="primary" onClick={() => updateNote(activeNote)} className="flex items-center"><Save className="h-4 w-4 mr-2" />Save</Button>
                    </div>
                    {/* AI Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="secondary"
                        onClick={() => handleAIAction('summary')}
                        disabled={aiState.isLoading || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {aiState.isLoading && aiState.type === 'summary' ? 'Summarizing...' : 'Summarize'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleAIAction('paraphrase')}
                        disabled={aiState.isLoading || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {aiState.isLoading && aiState.type === 'paraphrase' ? 'Paraphrasing...' : 'Paraphrase'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleAIAction('explanation')}
                        disabled={aiState.isLoading || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {aiState.isLoading && aiState.type === 'explanation' ? 'Explaining...' : 'Explain'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <style>
                      {`
                        .prose h1 { font-size: 1.875rem; font-weight: 700; margin: 1rem 0; }
                        .prose h2 { font-size: 1.5rem; font-weight: 700; margin: 0.75rem 0; }
                        .prose h3 { font-size: 1.25rem; font-weight: 700; margin: 0.5rem 0; }
                        .prose h4 { font-size: 1.125rem; font-weight: 600; margin: 0.5rem 0; }
                        .prose h5 { font-size: 1rem; font-weight: 600; margin: 0.25rem 0; }
                        .prose h6 { font-size: 0.875rem; font-weight: 600; margin: 0.25rem 0; }
                      `}
                    </style>
                    <div
                      className="prose max-w-none w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg p-4 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: processContentWithHighlighting(activeNote?.content || '') }}
                    />
                  </div>
                )}
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-2">Select a note to view or edit</h3>
                <p className="text-gray-500">Or create a new note to start taking notes</p>
              </div>
            )}
          </div>
        </div>

        {/* New Folder Dialog */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Folder</h3>
              <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="Folder name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" onKeyDown={(e) => e.key === 'Enter' && createNewFolder()} />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => { setNewFolderName(''); setShowNewFolderDialog(false); }}>Cancel</Button>
                <Button variant="primary" onClick={createNewFolder}>Create</Button>
              </div>
            </div>
          </div>
        )}

        {/* New Note Modal */}
        {showNewNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Note</h3>
              <input type="text" value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} placeholder="Note Title" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4" />
              <textarea value={newNoteContent} onChange={(e) => setNewNoteContent(e.target.value)} placeholder="Note Content (optional)" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 h-32" />
              <select value={newNoteFolder || ''} onChange={(e) => setNewNoteFolder(e.target.value || null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4">
                <option value="">Quick Note (No Folder)</option>
                {folders.map((folder) => (<option key={folder.id} value={folder.id}>{folder.name}</option>))}
              </select>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowNewNoteModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={createNewNote}>Create Note</Button>
              </div>
            </div>
          </div>
        )}

        {/* AI Modal */}
        {aiState.type && (
          <AIModal
            title={`AI ${aiState.type.charAt(0).toUpperCase() + aiState.type.slice(1)}`}
            content={aiState.content}
            originalText={(() => {
              if (!editor) return '';
              const selection = editor.state.selection;
              const text = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
              return text || editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
            })()}
            instruction={aiState.instruction}
            setInstruction={(instruction: any) => setAiState(prev => ({ ...prev, instruction }))}
            onRefine={handleAIRefine}
            onInsert={handleAIInsert}
            onReplace={handleAIReplace}
            onClose={() => setAiState({
              type: null,
              content: '',
              instruction: '',
              isLoading: false,
              isError: false
            })}
            isLoading={aiState.isLoading}
            isError={aiState.isError}
          />
        )}
      </div>
    </div>
  );
};

export default Notes;