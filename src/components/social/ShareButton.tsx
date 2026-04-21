import React, { useState } from 'react';
import { useShare } from '@/hooks/useShare';

interface ShareButtonProps {
  postId: string;
  className?: string;
}

export function ShareButton({ postId, className = '' }: ShareButtonProps) {
  const { sharePost, isLoading } = useShare();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');

  const handleShare = async () => {
    try {
      await sharePost(postId, message);
      setMessage('');
      setShowModal(false);
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors inline-flex items-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Share"
      >
        ↗️
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Share this post</h3>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message (optional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
