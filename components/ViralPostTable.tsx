import React from 'react';
import { ViralPost, Platform } from '../types';
import { ExternalLink, Bookmark, BookmarkCheck, Share2, TrendingUp, Users } from 'lucide-react';

interface ViralPostTableProps {
  posts: ViralPost[];
  onToggleSave: (id: string) => void;
}

const ViralPostTable: React.FC<ViralPostTableProps> = ({ posts, onToggleSave }) => {
  if (posts.length === 0) return null;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-4">Title & Hook</th>
              <th scope="col" className="px-6 py-4">Platform</th>
              <th scope="col" className="px-6 py-4 text-center">Metrics</th>
              <th scope="col" className="px-6 py-4">Creator Info</th>
              <th scope="col" className="px-6 py-4 text-center">Source</th>
              <th scope="col" className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {posts.map((post) => (
              <tr key={post.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-slate-900 dark:text-white line-clamp-1" title={post.title}>{post.title}</span>
                    <span className="text-xs text-brand-600 dark:text-brand-300 italic line-clamp-1" title={post.hook}>"{post.hook}"</span>
                    <div className="flex gap-2 mt-1">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 border border-slate-200 dark:border-slate-700">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    post.platform === Platform.TikTok ? 'text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-500/20 bg-pink-50 dark:bg-pink-500/10' :
                    post.platform === Platform.Instagram ? 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/10' :
                    post.platform === Platform.YouTubeShorts ? 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10' :
                    'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/10'
                  }`}>
                    {post.platform}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-center">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-mono">
                      <Share2 size={12} className="text-green-600 dark:text-green-500" />
                      {(post.shares / 1000).toFixed(1)}k
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <TrendingUp size={12} className="text-orange-500" />
                      {post.engagementScore}/100
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {post.sourceHandle ? (
                    <div className="flex flex-col">
                      <span className="text-slate-900 dark:text-white font-medium text-xs">@{post.sourceHandle}</span>
                      {post.sourceFollowers && (
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Users size={10} /> {post.sourceFollowers}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-600">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {post.sourceLink ? (
                    <a 
                      href={post.sourceLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 hover:bg-brand-500 hover:text-white dark:hover:bg-brand-500 transition-colors border border-slate-200 dark:border-slate-700 hover:border-brand-500"
                    >
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="text-slate-500 dark:text-slate-600">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => onToggleSave(post.id)}
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors border ${
                      post.isSaved 
                      ? 'bg-brand-500 text-white border-brand-500' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-brand-600 dark:hover:text-brand-400 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {post.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViralPostTable;