import React from 'react';
import { User, Trash2, Calendar, Smartphone, Video } from 'lucide-react';
import { InfluencerProfile } from '../types';

interface SettingsViewProps {
  savedInfluencers: InfluencerProfile[];
  onDeleteInfluencer: (id: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ savedInfluencers, onDeleteInfluencer }) => {
  return (
    <div className="space-y-8 pb-20">
      
      {/* Account Section Placeholder */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Account Settings</h2>
        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
             <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                U
             </div>
             <div>
                 <h3 className="font-bold text-slate-900 dark:text-white">User Profile</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400">Settings and preferences</p>
             </div>
        </div>
      </div>

      {/* Saved Influencers Section */}
      <div>
         <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <User size={24} className="text-brand-500" />
            Saved Influencers
         </h2>
         
         {savedInfluencers.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                <User size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white">No saved profiles</h3>
                <p className="text-slate-500 dark:text-slate-400">Generate and save influencers in the AI Studio.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedInfluencers.map(profile => (
                    <div key={profile.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                        <div className="relative aspect-square">
                            {profile.imageUrl ? (
                                <img src={profile.imageUrl} alt={profile.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <User size={32} className="text-slate-400" />
                                </div>
                            )}
                            <div className="absolute top-3 right-3">
                                <button 
                                    onClick={() => profile.id && onDeleteInfluencer(profile.id)}
                                    className="p-2 bg-black/50 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
                                    title="Delete Profile"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-slate-900/90 to-transparent p-4 pt-12">
                                <h3 className="text-white font-bold text-lg">{profile.name}</h3>
                                <div className="flex items-center gap-2 text-slate-300 text-xs mt-1">
                                    <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                                        <Smartphone size={10} /> {profile.platform}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4 flex-grow italic">
                                "{profile.bio}"
                            </p>
                            
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Calendar size={12} />
                                    {profile.dateCreated ? new Date(profile.dateCreated).toLocaleDateString() : 'Unknown Date'}
                                </span>
                                {profile.videoUrl && (
                                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                                        <Video size={12} /> Has Reel
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         )}
      </div>

    </div>
  );
};

export default SettingsView;