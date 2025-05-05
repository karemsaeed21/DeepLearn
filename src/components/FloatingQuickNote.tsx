import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from './ui/Button';

const FloatingQuickNote: React.FC = () => {
  const [showQuickNoteModal, setShowQuickNoteModal] = useState(false);
  const [quickNoteTitle, setQuickNoteTitle] = useState('');
  const [quickNoteContent, setQuickNoteContent] = useState('');
  // const [isOpen] = useState(false);

  const handleSaveQuickNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: quickNoteTitle || 'Untitled Note',
      content: quickNoteContent || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedNotes = JSON.parse(localStorage.getItem('learning-notes') || '[]');
    const updatedNotes = [newNote, ...savedNotes];
    localStorage.setItem('learning-notes', JSON.stringify(updatedNotes));

    setQuickNoteTitle('');
    setQuickNoteContent('');
    setShowQuickNoteModal(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div 
      >
        <button
          className={`fixed bottom-4 right-7 z-50 w-16 h-16
                   bg-gradient-to-br from-indigo-600 to-violet-600 
                   text-white rounded-2xl flex items-center justify-center
                   shadow-lg hover:shadow-xl transition-all duration-500
                   group hover:scale-105
                   `}
          onClick={() => setShowQuickNoteModal(true)}
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Quick Note Modal */}
      {showQuickNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Note</h3>
            <input
              type="text"
              value={quickNoteTitle}
              onChange={(e) => setQuickNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <textarea
              value={quickNoteContent}
              onChange={(e) => setQuickNoteContent(e.target.value)}
              placeholder="Note Content"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 h-32"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowQuickNoteModal(false)}
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
    </>
  );
};

export default FloatingQuickNote;