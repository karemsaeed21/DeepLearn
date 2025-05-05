import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Button from '../components/ui/Button';
import { Plus, Save, X, Edit2, Trash2 , ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

const FolderPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  if (!folderId) {
    throw new Error('Folder ID is required but was not provided.');
  }
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('learning-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    content: activeNote?.content || '',
    onUpdate: ({ editor }) => {
      if (activeNote) {
        setActiveNote({
          ...activeNote,
          content: editor.getHTML(),
        });
      }
    },
  });

  useEffect(() => {
    localStorage.setItem('learning-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (editor && activeNote) {
      editor.commands.setContent(activeNote.content);
    }
  }, [activeNote, editor]);

    const createNewNote = () => {
      if (!folderId) {
        console.error('Folder ID is undefined. Cannot create a note.');
        return;
      }

      const newNote: Note = {
        id: crypto.randomUUID(), // Generate a unique ID for the note
        folderId: folderId, // Associate the note with the current folder
        title: 'Untitled Note',
        content: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setNotes([newNote, ...notes]);
      setActiveNote(newNote);
      setIsEditing(true);
    };

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date() } : note
    );
    setNotes(updatedNotes);
    setActiveNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsEditing(false);
    }
  };

    const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); // Prevent default behavior
    const draggedNoteId = e.dataTransfer.getData('text/plain'); // Retrieve the dragged note ID
    if (draggedNoteId) {
      const updatedNotes = notes.map((note) =>
        note.id === draggedNoteId ? { ...note, folderId: folderId } : note
      );
      setNotes(updatedNotes);
      localStorage.removeItem('draggedNoteId'); // Clear the temporary storage
    }
  };

  const folderNotes = notes.filter((note) => note.folderId === folderId); // Only show notes for this folder
  return (
    <div className="container mx-auto px-4 pt-10 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/Study')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Notes
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Button
              variant="primary"
              onClick={createNewNote}
              className="w-full flex items-center justify-center mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
            <div
              className="space-y-3"
              onDragOver={(e) => e.preventDefault()} // Allow dropping
              onDrop={handleDrop} // Handle the drop event
            >
              {folderNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card
                    hoverable
                    className={`p-4 cursor-pointer ${
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {folderNotes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notes in this folder. Create your first note!
                </div>
              )}
            </div>
          </div>

          {/* Note Editor */}
          <div className="lg:w-3/4">
            {activeNote ? (
              <div className="p-6 border rounded-lg">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={activeNote.title}
                      onChange={(e) =>
                        setActiveNote({ ...activeNote, title: e.target.value })
                      }
                      className="w-full text-xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-500"
                      placeholder="Note Title"
                    />
                    <EditorContent
                      editor={editor}
                      className="w-full h-[500px] border border-gray-300 rounded-lg focus:outline-none p-4"
                    />
                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => updateNote(activeNote)}
                        className="flex items-center"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {activeNote.title}
                      </h2>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <div
                      className="w-full h-auto border border-gray-300 rounded-lg p-4"
                      dangerouslySetInnerHTML={{ __html: activeNote.content }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Select a note to view or edit
                </h3>
                <p className="text-gray-500">
                  Or create a new note to start taking notes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default FolderPage;

