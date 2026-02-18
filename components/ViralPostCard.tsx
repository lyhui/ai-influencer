import React from 'react';
import { ViralPost, Platform } from '../types';
import { Share2, TrendingUp, Eye, Bookmark, BookmarkCheck, PlayCircle, Hash, Globe, ExternalLink, AtSign, Users } from 'lucide-react';

interface ViralPostCardProps {
  post: ViralPost;
  onToggleSave: (id: string) => void;
}

const ViralPostCard: React.FC<ViralPostCardProps> = ({ post, onToggleSave }) => {

  const getPlatformColor = (p: Platform) => {
    switch(p) {
      case Platform.TikTok: return 'text-pink-600 dark:text-pink-500 bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/20';
      case Platform.Instagram: return 'text-purple-600 dark:text-purple-500 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
      case Platform.LinkedIn: return 'text-blue-600 dark:text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      case Platform.YouTubeShorts: return 'text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20';
      default: return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div 
      className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md"
    >
      {/* Absolute background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex justify-between items-start mb-4 z-10">
        <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPlatformColor(post.platform)} flex items-center gap-1`}>
                {post.platform === Platform.TikTok && <PlayCircle size={12} />}
                {post.platform}
            </span>
            <span className="px-2 py-1 rounded-full text-xs font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Globe size={10} />
                {post.region}
            </span>
        </div>
        <button 
          onClick={() => onToggleSave(post.id)}
          className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
        >
          {post.isSaved ? <BookmarkCheck className="text-brand-500 dark:text-brand-400" size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2 z-10">{post.title}</h3>
      
      <div className="mb-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 z-10">
        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold mb-1">The Hook</p>
        <p className="text-sm text-brand-700 dark:text-brand-200 italic">"{post.hook}"</p>
      </div>

      <div className="flex-grow z-10">
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">{post.contentDescription}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
           {post.tags.slice(0, 3).map(tag => (
             <span key={tag} className="text-xs text-slate-500 flex items-center gap-0.5 bg-slate-100 dark:bg-transparent px-1.5 py-0.5 rounded">
               <Hash size={10} />{tag}
             </span>
           ))}
        </div>

        {/* Source Video Section - Reference Only */}
        {(post.sourceLink) && (
          <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800/50">
             <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-bold tracking-wider">Reference</span>
                    
                    {/* Source Handle & Follower Count */}
                    <div className="flex items-center gap-3">
                        {post.sourceFollowers && (
                             <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                                <Users size={10} />
                                {post.sourceFollowers}
                             </span>
                        )}
                        {post.sourceHandle && (
                            <span className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1 font-mono truncate">
                            <AtSign size={10} />
                            {post.sourceHandle}
                            </span>
                        )}
                        <a 
                            href={post.sourceLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            title="Open Original"
                        >
                             <ExternalLink size={12} />
                        </a>
                    </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Shares (3d)</span>
            <span className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-1">
               <Share2 size={14} className="text-green-600 dark:text-green-500" />
               {(post.shares / 1000).toFixed(1)}k
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Score</span>
            <span className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-1">
               <TrendingUp size={14} className="text-orange-500" />
               {post.engagementScore}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-xs text-slate-500">Est. Reach</span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1">
               <Eye size={12} />
               {post.estimatedReach}
            </span>
        </div>
      </div>
    </div>
  );
};

export default ViralPostCard;