import { Bot, User, ThumbsUp, ThumbsDown, Download, Share2 } from 'lucide-react';
import type { Message } from './ChatInterface';
import { useState } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-gray-800/50 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-gray-400 text-sm">{message.content}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? 'bg-blue-600' : 'bg-gray-700'
        }`}
      >
        {isUser ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
      </div>

      <div className={`flex-1 max-w-2xl ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-800 text-gray-100 rounded-tl-sm'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          {message.imageUrl && (
            <div className="mt-3">
              <img
                src={message.imageUrl}
                alt="Generated or uploaded"
                className="rounded-lg max-w-full h-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          )}
        </div>

        {!isUser && message.imageUrl && (
          <div className="flex gap-2 mt-2 ml-2">
            <button
              onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
              className={`p-2 rounded-lg transition-colors ${
                feedback === 'like'
                  ? 'bg-green-600/20 text-green-400'
                  : 'bg-gray-800 text-gray-400 hover:text-green-400'
              }`}
              title="Like this result"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
              className={`p-2 rounded-lg transition-colors ${
                feedback === 'dislike'
                  ? 'bg-brand/20 text-brand'
                  : 'bg-gray-800 text-gray-400 hover:text-brand'
              }`}
              title="Dislike this result"
            >
              <ThumbsDown size={16} />
            </button>
            <button
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button
              className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
        )}

        <span className="text-xs text-gray-500 mt-1 ml-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}
