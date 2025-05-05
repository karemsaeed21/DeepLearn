import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEditor, EditorContent } from '@tiptap/react';
// import { useNavigate } from 'react-router-dom';
import StarterKit from '@tiptap/starter-kit';
// import Placeholder from '@tiptap/extension-placeholder';
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
} from 'lucide-react';

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

function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: any[]) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  };
}

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
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [paraphrasing, setParaphrasing] = useState(false);
  const [paraphrase, setParaphrase] = useState('');
  const [showParaphrase, setShowParaphrase] = useState(false);
  const [paraphraseInstruction, setParaphraseInstruction] = useState('');
  const [summaryInstruction, setSummaryInstruction] = useState('');
  const [trashedNotes, setTrashedNotes] = useState<Note[]>(() => {
    const savedTrashed = localStorage.getItem('trashed-notes');
    return savedTrashed ? JSON.parse(savedTrashed) : [];
  });

  // const navigate = useNavigate();

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeNote?.content || '',
    editable: isEditing && activeFolder !== 'trash', // Prevent editing if the note is in the trash
    onUpdate: ({ editor }) => {
      if (activeNote) {
        debouncedSetActiveNote({
          ...activeNote,
          content: editor.getHTML(),
        });
      }
    },
  });

  const debouncedSetActiveNote = useDebouncedCallback((updatedNote: Note) => {
    setActiveNote(updatedNote);
  }, 300); // 300ms debounce

  useEffect(() => {
    localStorage.setItem('learning-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('note-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (editor && activeNote) {
      editor.commands.setContent(activeNote.content);
    }
    // Only run when activeNote.id changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeNote?.id, editor]);

  useEffect(() => {
    if (editor && editor.isEmpty) {
      editor.commands.setContent('<p></p>');
    }
  }, [editor, activeNote]);

  useEffect(() => {
    if (editor && isEditing) {
      editor.commands.focus('end');
    }
  }, [isEditing, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  useEffect(() => {
    localStorage.setItem('trashed-notes', JSON.stringify(trashedNotes));
  }, [trashedNotes]);

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
      folder: newNoteFolder || undefined, // Associate the note with the selected folder
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setNewNoteFolder(null); // Reset folder selection
    setShowNewNoteModal(false);
  };

  const createNewFolder = () => {
  if (newFolderName.trim()) { // Ensure the folder name is not empty
    const newFolder: Folder = {
      id: Date.now().toString(), // Generate a unique ID
      name: newFolderName,
      createdAt: new Date(),
    };

    setFolders((prevFolders) => {
      const updatedFolders = [...prevFolders, newFolder];
      localStorage.setItem('note-folders', JSON.stringify(updatedFolders)); // Save to local storage
      return updatedFolders;
    });

    setNewFolderName(''); // Reset the input field
    setShowNewFolderDialog(false); // Close the dialog
    // navigate(`/folder/${newFolder.id}`); // Navigate to the new folder
  } else {
    alert('Folder name cannot be empty'); // Handle empty folder name
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
      // Move the note to the trash
      setTrashedNotes([noteToTrash, ...trashedNotes]);

      // Remove the note from the notes list
      setNotes(notes.filter((note) => note.id !== noteId));

      // Close the editor if the deleted note is being reviewed
      if (activeNote?.id === noteId) {
        setActiveNote(null); // Reset the active note
        setIsEditing(false); // Exit editing mode if active
      }
    }
  };

  const deleteFolder = (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder?')) {
      // Remove the folder
      const updatedFolders = folders.filter((folder) => folder.id !== folderId);
      setFolders(updatedFolders);

      // Remove notes associated with the folder
      const updatedNotes = notes.filter((note) => note.folder !== folderId);
      setNotes(updatedNotes);
    }
  };

  const filteredNotes = activeFolder === 'trash'
    ? trashedNotes
    : activeFolder
      ? notes.filter((note) => note.folder === activeFolder)
      : notes.filter((note) => !note.folder);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, noteId: string) => {
    e.dataTransfer.setData('text/plain', noteId); // Set the note ID in the drag event
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

  const EditorMenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
      >
        <Heading3 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>
    </div>
  );
};
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
          <p className="mt-2 text-gray-600">
            Organize your learning materials, summaries, and study notes.
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Create Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                variant="primary"
                onClick={() => {
                  setNewNoteFolder(activeFolder); // Set the folder to the currently active folder
                  setShowNewNoteModal(true);
                }}
                className="w-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewFolderDialog(true)}
                className="w-full flex items-center justify-center"
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                New Folder
              </Button>
            </div>

            {/* Folders */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Folders</h3>
              <div className="space-y-2">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, null)}
                  className="p-2 rounded-lg hover:bg-gray-50"
                >
                  <button
                    onClick={() => setActiveFolder(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      activeFolder === null ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    All Notes
                  </button>
                </div>
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, 'trash')}
                  className="p-2 rounded-lg hover:bg-gray-50"
                >
                  <button
                    onClick={() => setActiveFolder('trash')}
                    className={`w-full text-left px-3 py-2 rounded-lg ${
                      activeFolder === 'trash' ? 'bg-red-50 text-red-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    🗑️ Trash
                  </button>
                </div>
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="flex items-center justify-between"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, folder.id)}
                  >
                    {editingFolderId === folder.id ? (
                      <div className="flex-1 flex items-center">
                        <input
                          type="text"
                          value={editingFolderName}
                          onChange={(e) => setEditingFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateFolderName(folder.id);
                            if (e.key === 'Escape') {
                              setEditingFolderId(null);
                              setEditingFolderName('');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <button
                          onClick={() => updateFolderName(folder.id)}
                          className="ml-2 text-green-500 hover:text-green-600"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingFolderId(null);
                            setEditingFolderName('');
                          }}
                          className="ml-2 text-red-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => setActiveFolder(folder.id)}
                          className={`flex-1 text-left px-3 py-2 rounded-lg ${
                            activeFolder === folder.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                          }`}
                        >
                          {folder.name}
                        </button>
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              setEditingFolderId(folder.id);
                              setEditingFolderName(folder.name);
                            }}
                            className="text-gray-400 hover:text-blue-500 ml-2"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteFolder(folder.id)}
                            className="text-gray-400 hover:text-red-500 ml-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-3">
              {filteredNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div
                    draggable={true} // Enable dragging
                    onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, note.id)} // Handle drag event
                  >
                    <Card
                      hoverable
                      className={`p-4 cursor-pointer relative ${
                        activeNote?.id === note.id ? 'border-indigo-500 bg-indigo-50' : ''
                      }`}
                      onClick={() => {
                        setActiveNote(note);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{note.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(note.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {activeFolder !== 'trash' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => {
                                deleteNote(note.id);
                              }}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {activeFolder === 'trash' && (
                        <div className="flex items-center gap-1 absolute top-2 right-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Restore"
                            onClick={() => {
                              setNotes([note, ...notes]);
                              setTrashedNotes(trashedNotes.filter(n => n.id !== note.id));
                            }}
                            className="text-green-600 hover:bg-green-100"
                          >
                            <Undo2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete Forever"
                            onClick={() => {
                              if (confirm('Are you sure you want to permanently delete this note?')) {
                                setTrashedNotes(trashedNotes.filter(n => n.id !== note.id));
                              }
                            }}
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

              {filteredNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notes in this folder. Create your first note!
                </div>
              )}
            </div>
          </div>

          {/* Note Editor */}
          <div className="lg:w-3/4">
            {activeNote ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{activeNote.title}</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center"
                      disabled={activeFolder === 'trash'} // Disable if the note is in the trash
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Close"
                      onClick={() => {
                        setActiveNote(null);
                        setIsEditing(false);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                      className="w-full text-xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-500"
                      placeholder="Note Title"
                      disabled={activeFolder === 'trash'} // Disable input if the note is in the trash
                    />
                    <EditorMenuBar editor={editor} />
                    {!editor ? (
                      <div className="flex justify-center items-center h-40">Loading editor...</div>
                    ) : (
                      <EditorContent
                        editor={editor}
                        className="w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg focus:outline-none p-4 transition-shadow focus:ring-2 focus:ring-indigo-200 overflow-y-auto"
                      />
                    )}
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center"
                        disabled={activeFolder === 'trash'} // Disable if the note is in the trash
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => updateNote(activeNote)}
                        className="flex items-center"
                        disabled={activeFolder === 'trash'} // Disable if the note is in the trash
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          setSummarizing(true);
                          setShowSummary(true);
                          setSummary('');

                          // Get selected text or all text
                          let textToSummarize = '';
                          if (editor) {
                            const selection = editor.state.selection;
                            textToSummarize = editor.state.doc.textBetween(selection.from, selection.to, ' ');
                            if (!textToSummarize.trim()) {
                              // If nothing selected, use all text
                              textToSummarize = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ');
                            }
                          }

                          try {
                            const res = await fetch('http://localhost:11434/api/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                model: 'deepseek-r1:7b',
                                prompt: `Summarize the following text in a concise paragraph. Only return the summary. Do not include any questions or ask the user anything.\n\n${textToSummarize}`,
                              }),
                            });

                            if (!res.ok) {
                              setSummary('Error: ' + res.status + ' ' + res.statusText);
                              setSummarizing(false);
                              return;
                            }

                            if (!res.body) {
                              setSummary('Error: No response body received from server.');
                              setSummarizing(false);
                              return;
                            }

                            const reader = res.body.getReader();
                            let buffer = '';
                            while (true) {
                              const { done, value } = await reader.read();
                              if (done) break;
                              buffer += new TextDecoder().decode(value);
                            }
                            const lines = buffer.split('\n').filter(Boolean);
                            let summaryText = '';
                            for (const line of lines) {
                              try {
                                const json = JSON.parse(line);
                                if (json.response) summaryText += json.response;
                              } catch {}
                            }
                            setSummary(summaryText.trim());
                          } catch (err) {
                            setSummary('Error connecting to local Ollama.');
                          }
                          setSummarizing(false);
                        }}
                        disabled={summarizing}
                      >
                        {summarizing ? 'Summarizing...' : 'Summarize'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          setParaphrasing(true);
                          setShowParaphrase(true);
                          setParaphrase('');

                          // Get selected text or all text
                          let textToParaphrase = '';
                          if (editor) {
                            const selection = editor.state.selection;
                            textToParaphrase = editor.state.doc.textBetween(selection.from, selection.to, ' ');
                            if (!textToParaphrase.trim()) {
                              // If nothing selected, use all text
                              textToParaphrase = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ');
                            }
                          }

                          try {
                            const res = await fetch('http://localhost:11434/api/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                model: 'deepseek-r1:7b',
                                prompt: `Paraphrase the following text. Do not add any questions or extra commentary. Only return the paraphrased text.\n\n${textToParaphrase}`,
                              }),
                            });

                            if (!res.ok) {
                              setParaphrase('Error: ' + res.status + ' ' + res.statusText);
                              setParaphrasing(false);
                              return;
                            }

                            if (!res.body) {
                              setParaphrase('Error: No response body received from server.');
                              setParaphrasing(false);
                              return;
                            }

                            const reader = res.body.getReader();
                            let buffer = '';
                            while (true) {
                              const { done, value } = await reader.read();
                              if (done) break;
                              buffer += new TextDecoder().decode(value);
                            }
                            const lines = buffer.split('\n').filter(Boolean);
                            let paraphrasedText = '';
                            for (const line of lines) {
                              try {
                                const json = JSON.parse(line);
                                if (json.response) paraphrasedText += json.response;
                              } catch {}
                            }
                            setParaphrase(paraphrasedText.trim());
                          } catch (err) {
                            setParaphrase('Error connecting to local Ollama.');
                          }
                          setParaphrasing(false);
                        }}
                        disabled={paraphrasing}
                      >
                        {paraphrasing ? 'Paraphrasing...' : 'Paraphrase'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      className="w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg p-4 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: activeNote.content }}
                    />
                  </div>
                )}
              </Card>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Select a note to view or edit
                </h3>
                <p className="text-gray-500">Or create a new note to start taking notes</p>
              </div>
            )}
          </div>
        </div>

        {/* New Folder Dialog */}
        {showNewFolderDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Folder</h3>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)} // Ensure this updates the state
                placeholder="Folder name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewFolderName('');
                    setShowNewFolderDialog(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="primary" onClick={createNewFolder}>
                  Create
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* New Note Modal */}
        {showNewNoteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Note</h3>
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Note Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              />
              <textarea
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Note Content"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 h-32"
              />
              <select
                value={newNoteFolder || ''}
                onChange={(e) => setNewNoteFolder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              >
                <option value="">Quick Note (No Folder)</option>
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNewNoteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={createNewNote}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}

        {showSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">AI Summary</h3>
              <div className="mb-4 whitespace-pre-line text-gray-800">{summary || 'Summarizing...'}</div>
              <input
                type="text"
                value={summaryInstruction}
                onChange={e => setSummaryInstruction(e.target.value)}
                placeholder="Want a better summary? Add your instruction and press Enter"
                className="w-full border rounded px-3 py-2 mb-4"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && summaryInstruction.trim()) {
                    setSummarizing(true);
                    let textToSummarize = '';
                    if (editor) {
                      const selection = editor.state.selection;
                      textToSummarize = editor.state.doc.textBetween(selection.from, selection.to, ' ');
                      if (!textToSummarize.trim()) {
                        textToSummarize = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ');
                      }
                    }
                    try {
                      const res = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          model: 'gemma3:4b',
                          prompt: `Summarize the following text. ${summaryInstruction} Only return the summary. Do not include any questions or ask the user anything.\n\n${textToSummarize}`,
                        }),
                      });

                      if (!res.ok) {
                        setSummary('Error: ' + res.status + ' ' + res.statusText);
                        setSummarizing(false);
                        return;
                      }

                      if (!res.body) {
                        setSummary('Error: No response body received from server.');
                        setSummarizing(false);
                        return;
                      }

                      const reader = res.body.getReader();
                      let buffer = '';
                      while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        buffer += new TextDecoder().decode(value);
                      }
                      const lines = buffer.split('\n').filter(Boolean);
                      let summaryText = '';
                      for (const line of lines) {
                        try {
                          const json = JSON.parse(line);
                          if (json.response) summaryText += json.response;
                        } catch {}
                      }
                      setSummary(summaryText.trim());
                    } catch (err) {
                      setSummary('Error connecting to local Ollama.');
                    }
                    setSummarizing(false);
                    setSummaryInstruction('');
                  }
                }}
                disabled={summarizing}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSummary(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (editor && summary) {
                      const { from, to } = editor.state.selection;
                      if (from !== to) {
                        // Replace only the selected text
                        editor.commands.insertContentAt({ from, to }, summary);
                      } else {
                        // Replace all content
                        editor.commands.setContent(summary);
                      }
                    }
                    setShowSummary(false);
                  }}
                  disabled={!summary || summarizing}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}

        {showParaphrase && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">AI Paraphrase</h3>
              <div className="mb-4 whitespace-pre-line text-gray-800">{paraphrase || 'Paraphrasing...'}</div>
              <input
                type="text"
                value={paraphraseInstruction}
                onChange={e => setParaphraseInstruction(e.target.value)}
                placeholder="Want a better paraphrase? Add your instruction and press Enter"
                className="w-full border rounded px-3 py-2 mb-4"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && paraphraseInstruction.trim()) {
                    // Re-run paraphrasing with the new instruction
                    setParaphrasing(true);
                    let textToParaphrase = '';
                    if (editor) {
                      const selection = editor.state.selection;
                      textToParaphrase = editor.state.doc.textBetween(selection.from, selection.to, ' ');
                      if (!textToParaphrase.trim()) {
                        textToParaphrase = editor.state.doc.textBetween(0, editor.state.doc.content.size, ' ');
                      }
                    }
                    try {
                      const res = await fetch('http://localhost:11434/api/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          model: 'gemma3:4b',
                          prompt: `Paraphrase the following text. ${paraphraseInstruction} Do not add any questions or extra commentary. Only return the paraphrased text.\n\n${textToParaphrase}`,
                        }),
                      });

                      if (!res.ok) {
                        setParaphrase('Error: ' + res.status + ' ' + res.statusText);
                        setParaphrasing(false);
                        return;
                      }

                      if (!res.body) {
                        setParaphrase('Error: No response body received from server.');
                        setParaphrasing(false);
                        return;
                      }

                      const reader = res.body.getReader();
                      let buffer = '';
                      while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        buffer += new TextDecoder().decode(value);
                      }
                      const lines = buffer.split('\n').filter(Boolean);
                      let paraphrasedText = '';
                      for (const line of lines) {
                        try {
                          const json = JSON.parse(line);
                          if (json.response) paraphrasedText += json.response;
                        } catch {}
                      }
                      setParaphrase(paraphrasedText.trim());
                    } catch (err) {
                      setParaphrase('Error connecting to local Ollama.');
                    }
                    setParaphrasing(false);
                    setParaphraseInstruction('');
                  }
                }}
                disabled={paraphrasing}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowParaphrase(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (editor && paraphrase) {
                      const { from, to } = editor.state.selection;
                      if (from !== to) {
                        editor.commands.insertContentAt({ from, to }, paraphrase);
                      } else {
                        editor.commands.setContent(paraphrase);
                      }
                    }
                    setShowParaphrase(false);
                  }}
                  disabled={!paraphrase || paraphrasing}
                >
                  Accept
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Quick Note Button */}
      {/* <div className="fixed bottom-8 right-8 z-50">
        <Button
          variant="primary"
          className="rounded-full p-4 shadow-lg"
          onClick={() => setShowNewNoteModal(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div> */}
    </div>
  );
};

export default Notes;