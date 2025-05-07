import React from 'react';
import Button from '../ui/Button';
import { Clipboard, X } from 'lucide-react';
import { formatAIResponse } from '../../lib/aiUtils';

interface AIModalProps {
  title: string;
  content: string;
  originalText: string;
  instruction: string;
  setInstruction: (instruction: string) => void;
  onRefine: () => void;
  onInsert: () => void;
  onReplace: () => void;
  onClose: () => void;
  isLoading: boolean;
  isError: boolean;
}

export const AIModal: React.FC<AIModalProps> = ({
  title,
  content,
  originalText,
  instruction,
  setInstruction,
  onRefine,
  onInsert,
  onReplace,
  onClose,
  isLoading,
  isError
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigator.clipboard.writeText(content.replace(/<[^>]*>/g, ''))}
              title="Copy to clipboard"
            >
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
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
              {originalText || "No text selected"}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">{title.split('AI ')[1]}</h4>
            <div className={`p-3 rounded border h-64 overflow-y-auto text-sm text-gray-700 ${
              isError ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              {isLoading && !content ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                    <div className="h-2 w-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              ) : isError ? (
                <div className="text-red-600">{content}</div>
              ) : (
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatAIResponse(content) }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={instruction} 
              onChange={e => setInstruction(e.target.value)}
              placeholder={`Refine ${title.toLowerCase()} (e.g., 'make it shorter', 'focus on key points')`}
              className="flex-1 border rounded px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && instruction.trim()) {
                  onRefine();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              variant="secondary" 
              onClick={onRefine}
              disabled={!instruction.trim() || isLoading}
            >
              Refine
            </Button>
          </div>
          
          <div className="flex justify-between gap-2">
            <div className="text-xs text-gray-500">
              {content && !isError && (
                <span>{title.split('AI ')[1]} generated {new Date().toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onInsert}
                disabled={!content || isLoading || isError}
              >
                Insert to Note
              </Button>
              <Button 
                variant="primary" 
                onClick={onReplace}
                disabled={!content || isLoading || isError}
              >
                Replace Note
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};