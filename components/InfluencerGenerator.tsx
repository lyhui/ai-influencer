import React, { useState, useEffect } from 'react';
import { User, Users, Wand2, Sparkles, Loader2, CheckSquare, Square, AlertCircle, Clock, Video, Play, Smartphone, Download, Save, Check, X } from 'lucide-react';
import { ViralPost, InfluencerOptions, InfluencerProfile } from '../types';
import { generateAIInfluencer, generateInfluencerVideo } from '../services/geminiService';

interface InfluencerGeneratorProps {
  savedPosts: ViralPost[];
  onSaveProfile?: (profile: InfluencerProfile) => void;
}

const InfluencerGenerator: React.FC<InfluencerGeneratorProps> = ({ savedPosts, onSaveProfile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InfluencerProfile | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  // Video Generation State
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(true);
  
  // State to track which saved posts are selected for generation
  const [selectedPostIds, setSelectedPostIds] = useState<Set<string>>(new Set());

  // Initialize selection when savedPosts change
  useEffect(() => {
    // Default to selecting all posts initially
    setSelectedPostIds(new Set(savedPosts.map(p => p.id)));
  }, [savedPosts]);

  const [formData, setFormData] = useState<InfluencerOptions>({
    age: '20-25',
    sex: 'Female',
    race: 'Asian',
    character: 'Energetic, Relatable, Tech-savvy',
    language: 'English',
    expectedReach: '100k - 500k',
    contentDuration: '30 Seconds',
    platform: 'Instagram'
  });

  const togglePostSelection = (id: string) => {
    const newSelection = new Set(selectedPostIds);
    if (newSelection.has(id)) {
        newSelection.delete(id);
    } else {
        newSelection.add(id);
    }
    setSelectedPostIds(newSelection);
  };

  const handleGenerate = async () => {
    const postsToUse = savedPosts.filter(p => selectedPostIds.has(p.id));
    if (postsToUse.length === 0) return;

    setLoading(true);
    setResult(null);
    setVideoUrl(null);
    setIsSaved(false);
    setShowVideo(false);
    
    try {
      const profile = await generateAIInfluencer(postsToUse, formData);
      setResult(profile);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    if (result && onSaveProfile) {
        // Include the videoUrl if it exists
        const profileToSave = { ...result, videoUrl: videoUrl || undefined };
        onSaveProfile(profileToSave);
        setIsSaved(true);
    }
  };

  const handleGenerateVideo = async () => {
    if (!result) return;

    // Check for API Key Selection using window.aistudio as required for Veo
    try {
        const win = window as any;
        if (win.aistudio) {
            const hasKey = await win.aistudio.hasSelectedApiKey();
            if (!hasKey) {
                await win.aistudio.openSelectKey();
            }
        }
    } catch (e) {
        console.warn("AI Studio Key Check failed, proceeding to attempt generation anyway.", e);
    }

    setGeneratingVideo(true);
    try {
        const url = await generateInfluencerVideo(result);
        if (url) {
            setVideoUrl(url);
            setShowVideo(true);
            setIsSaved(false); // Reset save state so user can save the profile with the new video
        }
    } catch (error: any) {
        console.error("Video Gen Error", error);
        
        const errorMessage = error.message || error.toString();
        
        // Handle specific error for invalid/missing paid key
        if (errorMessage.includes("Requested entity was not found")) {
             const win = window as any;
             if (win.aistudio) {
                 try {
                     await win.aistudio.openSelectKey();
                 } catch(e) {
                     console.error("Failed to re-open select key", e);
                 }
                 alert("The selected API key may not be associated with a paid project. Please select a valid paid key and try again.");
                 setGeneratingVideo(false);
                 return;
             }
        }

        alert(`Video generation failed: ${errorMessage}`);
    } finally {
        setGeneratingVideo(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (savedPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
            <Users size={32} className="text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Saved Content</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          To generate an AI Influencer, you first need to save some viral posts to your database. 
          The AI needs to understand your niche and style preferences.
        </p>
      </div>
    );
  }

  const selectedCount = selectedPostIds.size;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-20">
      {/* Form Section */}
      <div className="flex flex-col gap-6">
        
        {/* Source Material Selection */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-brand-500 dark:text-brand-400" /> 
                    Source Material ({selectedCount})
                </h3>
                <div className="text-xs text-slate-500">
                    Select posts to inspire the persona
                </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {savedPosts.map(post => {
                    const isSelected = selectedPostIds.has(post.id);
                    return (
                        <div 
                            key={post.id}
                            onClick={() => togglePostSelection(post.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                                isSelected 
                                ? 'bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30' 
                                : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                        >
                            <div className={`mt-0.5 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-600'}`}>
                                {isSelected ? <CheckSquare size={16} /> : <Square size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isSelected ? 'text-brand-800 dark:text-brand-100' : 'text-slate-600 dark:text-slate-400'}`}>
                                    {post.title}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{post.hook}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
            {selectedCount === 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 p-2 rounded">
                    <AlertCircle size={12} />
                    Please select at least one post to generate a persona.
                </div>
            )}
        </div>

        {/* Persona Constraints */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 lg:p-8 flex-1 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-50 dark:bg-brand-500/20 rounded-lg text-brand-600 dark:text-brand-400">
                    <Wand2 size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Design Persona</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Customize your AI influencer's traits</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                         <Smartphone size={12} />
                         Target Platform
                    </label>
                    <select 
                        name="platform"
                        value={formData.platform}
                        onChange={handleChange}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                    >
                        <option value="Instagram">Instagram (Reels)</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube Shorts">YouTube Shorts</option>
                        <option value="LinkedIn">LinkedIn (Video)</option>
                        <option value="Twitter">Twitter / X</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Age Range</label>
                        <input 
                            type="text" 
                            name="age"
                            value={formData.age} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="e.g. 25-30"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Sex</label>
                        <select 
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                            <option>Female</option>
                            <option>Male</option>
                            <option>Non-binary</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Race / Ethnicity</label>
                        <input 
                            type="text" 
                            name="race"
                            value={formData.race} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="e.g. Asian, Mixed, Latino"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Primary Language</label>
                        <select 
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                            <option value="English">English</option>
                            <option value="Traditional Chinese">Traditional Chinese</option>
                            <option value="Simplified Chinese">Simplified Chinese</option>
                            <option value="Japanese">Japanese</option>
                            <option value="Spanish">Spanish</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Character & Personality</label>
                    <textarea 
                        name="character"
                        value={formData.character} 
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors resize-none"
                        placeholder="Describe the vibe (e.g. Sarcastic tech reviewer, Peaceful yoga instructor)"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Expected Reach</label>
                        <input 
                            type="text" 
                            name="expectedReach"
                            value={formData.expectedReach} 
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="e.g. 1 Million followers"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase flex items-center gap-1">
                             <Clock size={12} />
                             Preferred Duration
                        </label>
                        <select 
                            name="contentDuration"
                            value={formData.contentDuration}
                            onChange={handleChange}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 transition-colors"
                        >
                            <option value="15 Seconds">15 Seconds (Short Loop)</option>
                            <option value="30 Seconds">30 Seconds (Standard)</option>
                            <option value="60 Seconds">60 Seconds (Full Story)</option>
                            <option value="3 Minutes">3 Minutes (Long Form)</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || selectedCount === 0}
                    className="w-full mt-6 bg-gradient-to-r from-brand-600 to-accent-600 hover:from-brand-500 hover:to-accent-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-500/20"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    {loading ? 'Designing Influencer...' : 'Generate AI Persona'}
                </button>
            </div>
        </div>
      </div>

      {/* Result Section */}
      <div className="h-full">
         {result ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 shadow-xl">
                <div className="relative w-full aspect-square bg-slate-100 dark:bg-slate-950 flex items-center justify-center overflow-hidden group">
                   {videoUrl && showVideo ? (
                      <div className="relative w-full h-full">
                          <video 
                            src={videoUrl} 
                            controls 
                            className="w-full h-full object-cover" 
                            autoPlay
                          />
                          <button 
                             onClick={() => setShowVideo(false)}
                             className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-sm transition-all"
                             title="Close Preview"
                          >
                             <X size={20} />
                          </button>
                      </div>
                   ) : result.imageUrl ? (
                       <div className="relative w-full h-full">
                           <img src={result.imageUrl} alt={result.name} className="w-full h-full object-cover" />
                           {videoUrl && (
                               <button 
                                  onClick={() => setShowVideo(true)}
                                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors group"
                               >
                                  <div className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center shadow-lg transition-transform transform group-hover:scale-110">
                                      <Play size={32} className="text-brand-600 ml-1" />
                                  </div>
                               </button>
                           )}
                       </div>
                   ) : (
                       <div className="text-slate-400 dark:text-slate-600 flex flex-col items-center">
                           <User size={64} className="mb-2 opacity-50" />
                           <p>Image generation failed</p>
                       </div>
                   )}
                   
                   {(!videoUrl || !showVideo) && (
                     <>
                        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
                        <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
                            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-lg">{result.name}</h2>
                            <p className="text-brand-300 font-medium drop-shadow-md">{formData.language} • {formData.platform}</p>
                        </div>
                     </>
                   )}
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-start">
                        <div>
                             <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Bio</h4>
                             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50">
                                <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed">"{result.bio}"</p>
                             </div>
                        </div>
                        <button
                            onClick={handleSaveProfile}
                            disabled={isSaved}
                            className={`p-2 rounded-lg transition-colors border ${
                                isSaved 
                                ? 'bg-green-500/10 text-green-600 border-green-500/20 cursor-default' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-brand-500 border-slate-200 dark:border-slate-700'
                            }`}
                            title={isSaved ? "Profile Saved" : "Save Profile"}
                        >
                            {isSaved ? <Check size={20} /> : <Save size={20} />}
                        </button>
                    </div>
                    
                    <div>
                        <h4 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Viral Strategy ({formData.contentDuration})</h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{result.strategy}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                         {videoUrl ? (
                            <div className="space-y-3">
                                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl flex items-center gap-3">
                                    <CheckSquare className="text-green-600 dark:text-green-400" />
                                    <div>
                                        <h4 className="font-bold text-green-800 dark:text-green-400">Reel Generated!</h4>
                                        <p className="text-xs text-green-700 dark:text-green-500">Preview available above.</p>
                                    </div>
                                </div>
                                <a 
                                    href={videoUrl} 
                                    download={`${result.name.replace(/\s+/g, '_')}_reel.mp4`}
                                    className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
                                >
                                    <Download size={20} />
                                    Download {formData.contentDuration} Video
                                </a>
                            </div>
                         ) : (
                            <button
                                onClick={handleGenerateVideo}
                                disabled={generatingVideo}
                                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {generatingVideo ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating Reel (this may take a minute)...
                                    </>
                                ) : (
                                    <>
                                        <Video size={20} />
                                        Generate {formData.contentDuration} Reel
                                    </>
                                )}
                            </button>
                         )}
                         <p className="mt-2 text-xs text-center text-slate-400">
                            *Requires a paid API key via AI Studio to generate video.
                         </p>
                    </div>
                </div>
            </div>
         ) : (
             <div className="h-full min-h-[400px] border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-2xl flex flex-col items-center justify-center text-slate-500 dark:text-slate-600 bg-white dark:bg-slate-900/30 p-8 text-center shadow-sm">
                 {loading ? (
                     <div className="flex flex-col items-center gap-4">
                         <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-brand-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={20} className="text-brand-500" />
                            </div>
                         </div>
                         <div className="space-y-1">
                             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Generating Persona...</h3>
                             <p className="text-sm text-slate-500 dark:text-slate-400">Analyzing your {selectedCount} viral saves</p>
                             <p className="text-xs text-slate-400 dark:text-slate-500 animate-pulse">Creating photorealistic image...</p>
                         </div>
                     </div>
                 ) : (
                    <>
                        <User size={64} className="mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-2">Ready to Generate</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-600 max-w-xs">Select your source material above, set constraints, and click generate to see your custom AI influencer.</p>
                    </>
                 )}
             </div>
         )}
      </div>
    </div>
  );
};

export default InfluencerGenerator;