import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
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
  Clipboard,
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

const GEMINI_API_KEY = "AIzaSyDP5-ltToP59wrwEXQzX7UWfebYhSL_ZpU";

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

  // AI Feature States
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryInstruction, setSummaryInstruction] = useState('');

  const [paraphrasing, setParaphrasing] = useState(false);
  const [paraphrase, setParaphrase] = useState('');
  const [showParaphrase, setShowParaphrase] = useState(false);
  const [paraphraseInstruction, setParaphraseInstruction] = useState('');

  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanationInstruction, setExplanationInstruction] = useState('');

  const [trashedNotes, setTrashedNotes] = useState<Note[]>(() => {
    const savedTrashed = localStorage.getItem('trashed-notes');
    return savedTrashed ? JSON.parse(savedTrashed) : [];
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: activeNote?.content || '',
    editable: isEditing && activeFolder !== 'trash',
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
  }, 300);

  useEffect(() => {
    localStorage.setItem('learning-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('note-folders', JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    if (editor && activeNote?.content !== editor.getHTML()) {
      editor.commands.setContent(activeNote?.content || '<p></p>');
    } else if (editor && !activeNote && !editor.isEmpty) {
      editor.commands.setContent('<p></p>');
    }
  }, [activeNote?.id, activeNote?.content, editor]);

  useEffect(() => {
    if (editor && isEditing) {
      editor.commands.focus('end');
    }
  }, [isEditing, editor]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing && activeFolder !== 'trash');
    }
  }, [isEditing, editor, activeFolder]);

  useEffect(() => {
    localStorage.setItem('trashed-notes', JSON.stringify(trashedNotes));
  }, [trashedNotes]);

  const formatAIResponse = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^<p>/, '')
      .replace(/<\/p>$/, '');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ''));
  };

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

  const callGeminiAPI = async (
    promptText: string,
    setLoadingState: (loading: boolean) => void,
    setContentState: (content: string | ((prev: string) => string)) => void,
    setErrorState: (errorMsg: string) => void
  ) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GOOGLE_AI_API_KEY_HERE" as string) {
      setErrorState("Error: API Key not configured. Please set your Google AI API Key.");
      setLoadingState(false);
      return;
    }
    if (!promptText.trim()) {
      setErrorState("Error: Input text is empty.");
      setLoadingState(false);
      return;
    }
    setLoadingState(true);
    setContentState('');
    let accumulatedContent = '';
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: promptText }] }],
          generationConfig: {},
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          ]
        }),
      });
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ error: { message: "Unknown error with non-JSON response" } }));
        console.error('Gemini API Error:', errorBody);
        throw new Error(`API request failed (${res.status}) - ${errorBody.error?.message || res.statusText}`);
      }
      if (!res.body) throw new Error('Response body is null');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let eolIndex;
        while ((eolIndex = buffer.indexOf('\n')) >= 0) {
          const line = buffer.substring(0, eolIndex).trim();
          buffer = buffer.substring(eolIndex + 1);
          if (line.startsWith('data: ')) {
            const jsonString = line.substring('data: '.length);
            if (!jsonString.trim() || jsonString.trim() === '[DONE]') continue;
            try {
              const json = JSON.parse(jsonString);
              const textChunk = json.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textChunk) {
                accumulatedContent += textChunk;
                setContentState(prev => prev + formatAIResponse(textChunk));
              }
              if (json.error) {
                console.error("Error in stream from API:", json.error);
                accumulatedContent += `\n[API Stream Error: ${json.error.message || 'Unknown error in stream'}]`;
                setContentState(prev => prev + `\n[API Stream Error: ${json.error.message || 'Unknown error in stream'}]`);
              }
            } catch (e) {
              console.warn('Error parsing JSON line from stream:', jsonString, e);
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Error calling Gemini API:', err);
      setErrorState(`Error: ${err.message || 'Failed to connect or process request.'}`);
    } finally {
      setLoadingState(false);
    }
  };

  const EditorMenuBar: React.FC<{ editor: any }> = ({ editor }) => {
    if (!editor) return null;
    return (
      <div className="border-b border-gray-200 pb-4 mb-4 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-gray-200' : ''}><Bold className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-gray-200' : ''}><Italic className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}><Heading1 className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}><Heading2 className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}><Heading3 className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}><List className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}><ListOrdered className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}><Quote className="h-4 w-4" /></Button>
      </div>
    );
  };

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
                    <Card hoverable className={`p-4 cursor-pointer relative ${activeNote?.id === note.id ? 'border-indigo-500 bg-indigo-50' : ''}`} onClick={() => { setActiveNote(note); setIsEditing(false); }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{note.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
                        </div>
                        {activeFolder !== 'trash' && (<Button variant="ghost" size="icon" title="Delete" onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>)}
                      </div>
                      {activeFolder === 'trash' && (
                        <div className="flex items-center gap-1 absolute top-2 right-2">
                          <Button variant="ghost" size="icon" title="Restore" onClick={() => { setNotes([note, ...notes]); setTrashedNotes(trashedNotes.filter(n => n.id !== note.id)); if (activeNote?.id === note.id) setActiveNote(null); }} className="text-green-600 hover:bg-green-100"><Undo2 className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Delete Forever" onClick={() => { if (confirm('Are you sure you want to permanently delete this note?')) { setTrashedNotes(trashedNotes.filter(n => n.id !== note.id)); if (activeNote?.id === note.id) setActiveNote(null); } }} className="text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></Button>
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
            {activeNote ? (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{activeNote.title}</h2>
                  <div className="flex gap-2">
                    {!isEditing && activeFolder !== 'trash' && (<Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center"><Edit2 className="h-4 w-4 mr-2" />Edit</Button>)}
                    <Button variant="ghost" size="icon" title="Close" onClick={() => { setActiveNote(null); setIsEditing(false); }} className="text-gray-400 hover:text-red-500"><X className="h-5 w-5" /></Button>
                  </div>
                </div>
                {isEditing && activeFolder !== 'trash' ? (
                  <div className="space-y-4">
                    <input type="text" value={activeNote.title} onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })} className="w-full text-xl font-bold border-b border-gray-200 pb-2 focus:outline-none focus:border-indigo-500" placeholder="Note Title" />
                    <EditorMenuBar editor={editor} />
                    {!editor ? (<div className="flex justify-center items-center h-40">Loading editor...</div>) : (<EditorContent editor={editor} className="w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg focus:outline-none p-4 transition-shadow focus:ring-2 focus:ring-indigo-200 overflow-y-auto" />)}
                    <div className="flex justify-end space-x-3">
                      <Button variant="outline" onClick={() => { setIsEditing(false); if (editor && activeNote) editor.commands.setContent(notes.find(n => n.id === activeNote.id)?.content || activeNote.content); }} className="flex items-center"><X className="h-4 w-4 mr-2" />Cancel</Button>
                      <Button variant="primary" onClick={() => updateNote(activeNote)} className="flex items-center"><Save className="h-4 w-4 mr-2" />Save</Button>
                    </div>
                    {/* AI Buttons */}
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          let textToSummarize = '';
                          if (editor) {
                            const selection = editor.state.selection;
                            textToSummarize = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                            if (!textToSummarize.trim()) textToSummarize = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                          }
                          if (!textToSummarize.trim()) { setSummary("Please select text or add content to summarize."); setShowSummary(true); return; }
                          setShowSummary(true);
                          const prompt = `Summarize the following text in a concise paragraph. Only return the summary.\n\nText:\n${textToSummarize}`;
                          callGeminiAPI(prompt, setSummarizing, setSummary, (errMsg) => setSummary(errMsg));
                        }}
                        disabled={summarizing || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {summarizing ? 'Summarizing...' : 'Summarize'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          let textToParaphrase = '';
                          if (editor) {
                            const selection = editor.state.selection;
                            textToParaphrase = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                            if (!textToParaphrase.trim()) textToParaphrase = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                          }
                          if (!textToParaphrase.trim()) { setParaphrase("Please select text or add content to paraphrase."); setShowParaphrase(true); return; }
                          setShowParaphrase(true);
                          const prompt = `Paraphrase the following text. Rephrase it in your own words while maintaining the original meaning. Only return the paraphrased text.\n\nOriginal Text:\n${textToParaphrase}`;
                          callGeminiAPI(prompt, setParaphrasing, setParaphrase, (errMsg) => setParaphrase(errMsg));
                        }}
                        disabled={paraphrasing || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {paraphrasing ? 'Paraphrasing...' : 'Paraphrase'}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={async () => {
                          let textToExplain = '';
                          if (editor) {
                            const selection = editor.state.selection;
                            textToExplain = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                            if (!textToExplain.trim()) {
                              textToExplain = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                            }
                          }
                          if (!textToExplain.trim()) {
                            setExplanation("Please select text or add content to explain.");
                            setShowExplanation(true);
                            return;
                          }
                          setShowExplanation(true);
                          const prompt = `Explain the following text in a clear and detailed way. Break down complex concepts if necessary. Provide examples if it helps clarify the meaning. Keep the tone informative and easy to understand.\n\nText to Explain:\n${textToExplain}`;
                          callGeminiAPI(prompt, setExplaining, setExplanation, (errMsg) => setExplanation(errMsg));
                        }}
                        disabled={explaining || activeFolder === 'trash'}
                        className="flex items-center"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {explaining ? 'Explaining...' : 'Explain'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="prose max-w-none w-full h-[400px] max-h-[400px] border border-gray-300 rounded-lg p-4 overflow-y-auto" dangerouslySetInnerHTML={{ __html: activeNote.content }} />
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

        {/* Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">AI Summary</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(summary)}
                  title="Copy to clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSummary(false)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text</h4>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {(() => {
                    let originalText = '';
                    if (editor) {
                      const selection = editor.state.selection;
                      originalText = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                      if (!originalText.trim()) originalText = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                    }
                    return originalText || "No text selected";
                  })()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                <div className="p-3 bg-green-50 rounded border border-green-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {summarizing && !summary ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                      </div>
                    </div>
                  ) : summary.startsWith("Error:") ? (
                    <div className="text-red-600">{summary}</div>
                  ) : (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(summary) }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={summaryInstruction} 
                  onChange={e => setSummaryInstruction(e.target.value)}
                  placeholder="Refine summary (e.g., 'make it shorter', 'focus on key points')"
                  className="flex-1 border rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && summaryInstruction.trim()) {
                      let textToSummarize = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToSummarize = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToSummarize.trim()) textToSummarize = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToSummarize.trim()) { setSummary("No text to summarize."); return; }
                      const prompt = `Summarize the following text. Instruction: "${summaryInstruction}". Only return the refined summary.\n\nText:\n${textToSummarize}`;
                      callGeminiAPI(prompt, setSummarizing, setSummary, (errMsg) => setSummary(errMsg));
                      setSummaryInstruction('');
                    }
                  }}
                  disabled={summarizing}
                />
                <Button 
                  variant="secondary" 
                  onClick={async () => {
                    if (summaryInstruction.trim()) {
                      let textToSummarize = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToSummarize = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToSummarize.trim()) textToSummarize = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToSummarize.trim()) { setSummary("No text to summarize."); return; }
                      const prompt = `Summarize the following text. Instruction: "${summaryInstruction}". Only return the refined summary.\n\nText:\n${textToSummarize}`;
                      callGeminiAPI(prompt, setSummarizing, setSummary, (errMsg) => setSummary(errMsg));
                      setSummaryInstruction('');
                    }
                  }}
                  disabled={!summaryInstruction.trim() || summarizing}
                >
                  Refine
                </Button>
              </div>
              
              <div className="flex justify-between gap-2">
                <div className="text-xs text-gray-500">
                  {summary && !summary.startsWith("Error:") && (
                    <span>Summary generated {new Date().toLocaleTimeString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (editor && summary && !summary.startsWith("Error:")) {
                        const { from, to } = editor.state.selection;
                        const formattedSummary = `<div class="ai-summary"><h3>Summary</h3>${formatAIResponse(summary)}</div>`;
                        if (from !== to) {
                          editor.commands.insertContentAt({ from, to }, formattedSummary);
                        } else {
                          editor.commands.insertContent(formattedSummary);
                        }
                      }
                      setShowSummary(false);
                    }}
                    disabled={!summary || summarizing || summary.startsWith("Error:")}
                  >
                    Insert to Note
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      if (editor && summary && !summary.startsWith("Error:")) {
                        const formattedSummary = formatAIResponse(summary);
                        editor.commands.setContent(`<h1>${activeNote?.title || 'Summary'}</h1>${formattedSummary}`);
                      }
                      setShowSummary(false);
                    }}
                    disabled={!summary || summarizing || summary.startsWith("Error:")}
                  >
                    Replace Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Paraphrase Modal */}
      {showParaphrase && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">AI Paraphrase</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(paraphrase)}
                  title="Copy to clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowParaphrase(false)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text</h4>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {(() => {
                    let originalText = '';
                    if (editor) {
                      const selection = editor.state.selection;
                      originalText = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                      if (!originalText.trim()) originalText = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                    }
                    return originalText || "No text selected";
                  })()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Paraphrased Version</h4>
                <div className="p-3 bg-green-50 rounded border border-green-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {paraphrasing && !paraphrase ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                      </div>
                    </div>
                  ) : paraphrase.startsWith("Error:") ? (
                    <div className="text-red-600">{paraphrase}</div>
                  ) : (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(paraphrase) }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={paraphraseInstruction} 
                  onChange={e => setParaphraseInstruction(e.target.value)}
                  placeholder="Refine paraphrase (e.g., 'make it simpler', 'more formal')"
                  className="flex-1 border rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && paraphraseInstruction.trim()) {
                      let textToParaphrase = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToParaphrase = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToParaphrase.trim()) textToParaphrase = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToParaphrase.trim()) { setParaphrase("No text to paraphrase."); return; }
                      const prompt = `Paraphrase the following text. Instruction: "${paraphraseInstruction}". Only return the refined paraphrased text.\n\nOriginal Text:\n${textToParaphrase}`;
                      callGeminiAPI(prompt, setParaphrasing, setParaphrase, (errMsg) => setParaphrase(errMsg));
                      setParaphraseInstruction('');
                    }
                  }}
                  disabled={paraphrasing}
                />
                <Button 
                  variant="secondary" 
                  onClick={async () => {
                    if (paraphraseInstruction.trim()) {
                      let textToParaphrase = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToParaphrase = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToParaphrase.trim()) textToParaphrase = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToParaphrase.trim()) { setParaphrase("No text to paraphrase."); return; }
                      const prompt = `Paraphrase the following text. Instruction: "${paraphraseInstruction}". Only return the refined paraphrased text.\n\nOriginal Text:\n${textToParaphrase}`;
                      callGeminiAPI(prompt, setParaphrasing, setParaphrase, (errMsg) => setParaphrase(errMsg));
                      setParaphraseInstruction('');
                    }
                  }}
                  disabled={!paraphraseInstruction.trim() || paraphrasing}
                >
                  Refine
                </Button>
              </div>
              
              <div className="flex justify-between gap-2">
                <div className="text-xs text-gray-500">
                  {paraphrase && !paraphrase.startsWith("Error:") && (
                    <span>Paraphrase generated {new Date().toLocaleTimeString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (editor && paraphrase && !paraphrase.startsWith("Error:")) {
                        const { from, to } = editor.state.selection;
                        const formattedParaphrase = `<div class="ai-paraphrase"><h3>Paraphrased Version</h3>${formatAIResponse(paraphrase)}</div>`;
                        if (from !== to) {
                          editor.commands.insertContentAt({ from, to }, formattedParaphrase);
                        } else {
                          editor.commands.insertContent(formattedParaphrase);
                        }
                      }
                      setShowParaphrase(false);
                    }}
                    disabled={!paraphrase || paraphrasing || paraphrase.startsWith("Error:")}
                  >
                    Insert to Note
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      if (editor && paraphrase && !paraphrase.startsWith("Error:")) {
                        const formattedParaphrase = formatAIResponse(paraphrase);
                        editor.commands.setContent(`<h1>${activeNote?.title || 'Paraphrased Content'}</h1>${formattedParaphrase}`);
                      }
                      setShowParaphrase(false);
                    }}
                    disabled={!paraphrase || paraphrasing || paraphrase.startsWith("Error:")}
                  >
                    Replace Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Explanation Modal */}
      {showExplanation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">AI Explanation</h3>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => copyToClipboard(explanation)}
                  title="Copy to clipboard"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowExplanation(false)}
                  title="Close"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Original Text</h4>
                <div className="p-3 bg-gray-50 rounded border border-gray-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {(() => {
                    let originalText = '';
                    if (editor) {
                      const selection = editor.state.selection;
                      originalText = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                      if (!originalText.trim()) originalText = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                    }
                    return originalText || "No text selected";
                  })()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Explanation</h4>
                <div className="p-3 bg-green-50 rounded border border-green-200 h-64 overflow-y-auto text-sm text-gray-700">
                  {explaining && !explanation ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-pulse flex space-x-2">
                        <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                        <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                      </div>
                    </div>
                  ) : explanation.startsWith("Error:") ? (
                    <div className="text-red-600">{explanation}</div>
                  ) : (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formatAIResponse(explanation) }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={explanationInstruction} 
                  onChange={e => setExplanationInstruction(e.target.value)}
                  placeholder="Refine explanation (e.g., 'simpler terms', 'more technical', 'with examples')"
                  className="flex-1 border rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter' && explanationInstruction.trim()) {
                      let textToExplain = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToExplain = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToExplain.trim()) textToExplain = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToExplain.trim()) { setExplanation("No text to explain."); return; }
                      const prompt = `Explain the following text. Instruction: "${explanationInstruction}". Provide a clear and detailed explanation.\n\nText to Explain:\n${textToExplain}`;
                      callGeminiAPI(prompt, setExplaining, setExplanation, (errMsg) => setExplanation(errMsg));
                      setExplanationInstruction('');
                    }
                  }}
                  disabled={explaining}
                />
                <Button 
                  variant="secondary" 
                  onClick={async () => {
                    if (explanationInstruction.trim()) {
                      let textToExplain = '';
                      if (editor) {
                        const selection = editor.state.selection;
                        textToExplain = editor.state.doc.textBetween(selection.from, selection.to, '\n\n');
                        if (!textToExplain.trim()) textToExplain = editor.state.doc.textBetween(0, editor.state.doc.content.size, '\n\n');
                      }
                      if (!textToExplain.trim()) { setExplanation("No text to explain."); return; }
                      const prompt = `Explain the following text. Instruction: "${explanationInstruction}". Provide a clear and detailed explanation.\n\nText to Explain:\n${textToExplain}`;
                      callGeminiAPI(prompt, setExplaining, setExplanation, (errMsg) => setExplanation(errMsg));
                      setExplanationInstruction('');
                    }
                  }}
                  disabled={!explanationInstruction.trim() || explaining}
                >
                  Refine
                </Button>
              </div>
              
              <div className="flex justify-between gap-2">
                <div className="text-xs text-gray-500">
                  {explanation && !explanation.startsWith("Error:") && (
                    <span>Explanation generated {new Date().toLocaleTimeString()}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (editor && explanation && !explanation.startsWith("Error:")) {
                        const { from, to } = editor.state.selection;
                        const formattedExplanation = `<div class="ai-explanation"><h3>Explanation</h3>${formatAIResponse(explanation)}</div>`;
                        if (from !== to) {
                          editor.commands.insertContentAt({ from, to }, formattedExplanation);
                        } else {
                          editor.commands.insertContent(formattedExplanation);
                        }
                      }
                      setShowExplanation(false);
                    }}
                    disabled={!explanation || explaining || explanation.startsWith("Error:")}
                  >
                    Insert to Note
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => {
                      if (editor && explanation && !explanation.startsWith("Error:")) {
                        const formattedExplanation = formatAIResponse(explanation);
                        editor.commands.setContent(`<h1>${activeNote?.title || 'Detailed Explanation'}</h1>${formattedExplanation}`);
                      }
                      setShowExplanation(false);
                    }}
                    disabled={!explanation || explaining || explanation.startsWith("Error:")}
                  >
                    Replace Note
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Notes;