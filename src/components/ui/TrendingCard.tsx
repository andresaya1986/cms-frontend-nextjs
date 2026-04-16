'use client';

import React from 'react';

interface TrendingTopic {
  id: string;
  name: string;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

interface TrendingCardProps {
  topics?: TrendingTopic[];
}

export function TrendingCard({ topics = [] }: TrendingCardProps) {
  const defaultTopics: TrendingTopic[] = [
    { id: '1', name: 'React', count: 2543, trend: 'up' },
    { id: '2', name: 'Next.js', count: 1982, trend: 'up' },
    { id: '3', name: 'TypeScript', count: 1645, trend: 'stable' },
    { id: '4', name: 'Tailwind CSS', count: 1204, trend: 'up' },
    { id: '5', name: 'Web Development', count: 892, trend: 'down' },
  ];

  const displayTopics = topics.length > 0 ? topics : defaultTopics;

  return (
    <div className="bg-white rounded-xl shadow-cm border border-neutral-200 overflow-hidden sticky top-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h3 className="font-bold text-lg text-neutral-900">🔥 Tendencias</h3>
        <p className="text-xs text-neutral-600">Lo que está pasando ahora</p>
      </div>

      {/* Topics */}
      <div className="divide-y divide-neutral-200">
        {displayTopics.map((topic) => (
          <button
            key={topic.id}
            className="w-full px-6 py-3 hover:bg-neutral-50 transition-colors text-left group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-xs text-neutral-600 group-hover:text-primary-600">Tema Trending</p>
                <p className="font-bold text-neutral-900">#{topic.name}</p>
                <p className="text-sm text-neutral-600">{topic.count.toLocaleString()} posts</p>
              </div>
              <span
                className={`text-lg ${
                  topic.trend === 'up'
                    ? '📈'
                    : topic.trend === 'down'
                    ? '📉'
                    : '➡️'
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-200">
        <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
          Ver todas las tendencias →
        </button>
      </div>
    </div>
  );
}
