import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from './ui/Button';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [showNewNoteModal, setShowNewNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const handleSaveQuickNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: newNoteTitle || 'Untitled Note',
      content: newNoteContent || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedNotes = JSON.parse(localStorage.getItem('learning-notes') || '[]');
    const updatedNotes = [newNote, ...savedNotes];
    localStorage.setItem('learning-notes', JSON.stringify(updatedNotes));

    setNewNoteTitle('');
    setNewNoteContent('');
    setShowNewNoteModal(false);
  };

  return (
    <div className="relative">
      {children}

      {/* Floating Quick Note Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          variant="primary"
          className="rounded-full p-4 shadow-lg"
          onClick={() => setShowNewNoteModal(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Quick Note Modal */}
      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Note</h3>
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
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowNewNoteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveQuickNote}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;