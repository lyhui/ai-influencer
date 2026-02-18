import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, RefreshCw, Database, Globe, Languages, BarChart3, LayoutGrid, List, Download, ChevronDown, Check, PlayCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ViralPostCard from './components/ViralPostCard';
import ViralPostTable from './components/ViralPostTable';
import StatCard from './components/StatCard';
import { GridSkeleton, TableSkeleton } from './components/LoadingSkeleton';
import InfluencerGenerator from './components/InfluencerGenerator';
import SettingsView from './components/SettingsView';
import { ViralPost, InfluencerProfile, Platform } from './types';
import { generateViralPosts, analyzeCompetitorViralStrategy } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('discover');
  const [industry, setIndustry] = useState('Tech SaaS');
  const [region, setRegion] = useState('United States');
  const [language, setLanguage] = useState('English');
  const [minShares, setMinShares] = useState<number>(100000);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Platform Selection State
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.Instagram, Platform.TikTok, Platform.YouTubeShorts]);
  const [showPlatformDropdown, setShowPlatformDropdown] = useState(false);

  const [posts, setPosts] = useState<ViralPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [strategy, setStrategy] = useState<string | null>(null);
  
  // Saved Influencers State
  const [savedInfluencers, setSavedInfluencers] = useState<InfluencerProfile[]>(() => {
    const saved = localStorage.getItem('savedInfluencers');
    return saved ? JSON.parse(saved) : [];
  });

  // Draft State for Influencer Generator (Persist across tab switches)
  const [draftProfile, setDraftProfile] = useState<InfluencerProfile | null>(null);
  const [draftVideoUrl, setDraftVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('savedInfluencers', JSON.stringify(savedInfluencers));
  }, [savedInfluencers]);

  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Apply theme class to HTML element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Stats state
  const totalPosts = posts.length;
  const savedPostsCount = posts.filter(p => p.isSaved).length;
  const avgShares = posts.length > 0 ? (posts.reduce((acc, curr) => acc + curr.shares, 0) / posts.length).toFixed(0) : "0";

  const togglePlatform = (platform: Platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(prev => prev.filter(p => p !== platform));
      }
    } else {
      setSelectedPlatforms(prev => [...prev, platform]);
    }
  };

  const handleSearch = async () => {
    if (!industry.trim()) return;
    setLoading(true);
    setStrategy(null);
    try {
      // Parallel execution for analysis and content generation
      const [fetchedPosts, strategyText] = await Promise.all([
        generateViralPosts(industry, region, language, minShares, selectedPlatforms),
        analyzeCompetitorViralStrategy(industry, region, language)
      ]);
      
      setPosts(fetchedPosts);
      setStrategy(strategyText);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, isSaved: !post.isSaved } : post
    ));
  };

  const saveInfluencerProfile = (profile: InfluencerProfile) => {
    setSavedInfluencers(prev => {
      const exists = prev.some(p => p.id === profile.id);
      if (exists) {
        return prev.map(p => p.id === profile.id ? profile : p);
      }
      return [profile, ...prev];
    });
  };

  const deleteInfluencerProfile = (id: string) => {
    setSavedInfluencers(prev => prev.filter(p => p.id !== id));
  };

  const handleExportCSV = () => {
    if (posts.length === 0) return;

    // Define CSV Headers
    const headers = [
      'Title', 
      'Hook', 
      'Industry', 
      'Platform', 
      'Shares', 
      'Engagement Score', 
      'Creator Handle', 
      'Creator Followers', 
      'Link'
    ];

    // Map data to CSV rows
    const csvContent = [
      headers.join(','),
      ...posts.map(post => [
        `"${post.title.replace(/"/g, '""')}"`,
        `"${post.hook.replace(/"/g, '""')}"`,
        `"${post.industry}"`,
        post.platform,
        post.shares,
        post.engagementScore,
        post.sourceHandle || '',
        `"${post.sourceFollowers || ''}"`,
        post.sourceLink || ''
      ].join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `viral_vault_${industry.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter posts based on view
  const displayPosts = currentView === 'database' 
    ? posts.filter(p => p.isSaved) 
    : posts;

  // Render content based on active view
  const renderContent = () => {
    if (currentView === 'influencer') {
      return (
        <InfluencerGenerator 
            savedPosts={posts.filter(p => p.isSaved)} 
            onSaveProfile={saveInfluencerProfile}
            draftProfile={draftProfile}
            setDraftProfile={setDraftProfile}
            draftVideoUrl={draftVideoUrl}
            setDraftVideoUrl={setDraftVideoUrl}
        />
      );
    }

    if (currentView === 'settings') {
      return (
        <SettingsView 
            savedInfluencers={savedInfluencers} 
            onDeleteInfluencer={deleteInfluencerProfile}
        />
      );
    }

    if (currentView === 'analytics') {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl text-center max-w-md shadow-lg border border-slate-200 dark:border-transparent">
              <Sparkles size={48} className="mx-auto text-brand-500 mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro Analytics</h2>
              <p className="mb-6">Deep dive analytics for industry trends are coming soon. Current session data:</p>
              <ul className="text-left space-y-2 mb-6 bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                <li className="flex justify-between"><span>Avg. Shares:</span> <span className="text-slate-900 dark:text-white font-mono">{Number(avgShares).toLocaleString()}</span></li>
                <li className="flex justify-between"><span>Saved Items:</span> <span className="text-slate-900 dark:text-white font-mono">{savedPostsCount}</span></li>
              </ul>
              <button 
                onClick={() => setCurrentView('discover')}
                className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg transition-colors"
              >
                Back to Discover
              </button>
           </div>
        </div>
      )
    }

    return (
      <>
        {/* Strategy Insight Banner */}
        {strategy && currentView === 'discover' && (
           <div className="mb-8 p-6 bg-gradient-to-r from-brand-50 to-white dark:from-brand-900/50 dark:to-slate-900 border border-brand-200 dark:border-brand-500/30 rounded-2xl shadow-sm">
              <h3 className="text-brand-600 dark:text-brand-300 font-bold mb-2 flex items-center gap-2">
                <Sparkles size={16} /> 
                AI Viral Strategy Analysis for {industry} in {region}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{strategy}</p>
           </div>
        )}

        {/* View Controls (Only for Discover/Database) */}
        {(currentView === 'discover' || currentView === 'database') && (
           <div className="flex justify-end mb-4 gap-2">
              <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center shadow-sm">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    title="Grid View"
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('table')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-slate-100 dark:bg-slate-700 text-brand-600 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'}`}
                    title="Table View"
                  >
                    <List size={18} />
                  </button>
              </div>
              
              <button 
                 onClick={handleExportCSV}
                 disabled={posts.length === 0}
                 className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                 title="Export to Excel (CSV)"
              >
                 <Download size={18} />
                 <span className="hidden sm:inline text-sm font-medium">Export</span>
              </button>
           </div>
        )}

        {/* Results */}
        {loading ? (
           viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
               {Array.from({ length: 6 }).map((_, i) => <GridSkeleton key={i} />)}
             </div>
           ) : (
             <TableSkeleton />
           )
        ) : displayPosts.length > 0 ? (
           viewMode === 'grid' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
               {displayPosts.map(post => (
                 <ViralPostCard key={post.id} post={post} onToggleSave={toggleSave} />
               ))}
             </div>
           ) : (
             <ViralPostTable posts={displayPosts} onToggleSave={toggleSave} />
           )
        ) : (
           <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
              <Database size={64} className="mb-4 opacity-20" />
              <p className="text-lg">No viral data found. Try searching for an industry.</p>
              <p className="text-sm opacity-60">Try "Fitness Coaching", "Real Estate", or "Vegan Food"</p>
           </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-brand-500/30 transition-colors duration-300">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <main className="ml-16 md:ml-20 lg:ml-64 min-h-screen p-4 lg:p-8 relative">
        {/* Top Header Area */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
              {currentView === 'database' ? 'My Database' : 
               currentView === 'influencer' ? 'AI Influencer Studio' : 
               currentView === 'settings' ? 'Settings' : 'Viral Discovery'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {currentView === 'database' 
                ? 'Your curated collection of high-performing concepts.' 
                : currentView === 'influencer'
                ? 'Create the perfect personality to execute your viral strategy.'
                : currentView === 'settings'
                ? 'Manage your preferences and saved profiles.'
                : ''}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto items-center">
            {currentView === 'discover' && (
              <>
                {/* Platform Multi-Select */}
                <div className="relative min-w-[160px] z-20">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PlayCircle className="h-4 w-4 text-slate-500" />
                  </div>
                  <button
                    onClick={() => setShowPlatformDropdown(!showPlatformDropdown)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-left text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm flex items-center justify-between gap-2"
                  >
                    <span className="truncate block text-sm">
                       {selectedPlatforms.length === Object.values(Platform).length ? 'All Platforms' : `${selectedPlatforms.length} Platforms`}
                    </span>
                    <ChevronDown size={14} className="text-slate-500 shrink-0" />
                  </button>
                  
                  {showPlatformDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowPlatformDropdown(false)} 
                      />
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden py-1 max-h-80 overflow-y-auto">
                        {Object.values(Platform).map((p) => (
                          <div 
                            key={p}
                            onClick={() => togglePlatform(p)}
                            className="px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between text-sm text-slate-700 dark:text-slate-200 transition-colors"
                          >
                            <span>{p}</span>
                            {selectedPlatforms.includes(p) && <Check size={16} className="text-brand-500" />}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Min Shares Selector */}
                <div className="relative group min-w-[140px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BarChart3 className="h-4 w-4 text-slate-500" />
                  </div>
                  <select 
                    value={minShares}
                    onChange={(e) => setMinShares(Number(e.target.value))}
                    className="block w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value={1000}>1k+ Shares</option>
                    <option value={5000}>5k+ Shares</option>
                    <option value={10000}>10k+ Shares</option>
                    <option value={50000}>50k+ Shares</option>
                    <option value={100000}>100k+ Shares</option>
                    <option value={500000}>500k+ Shares</option>
                    <option value={1000000}>1M+ Shares</option>
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* Language Selector */}
                <div className="relative group min-w-[140px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Languages className="h-4 w-4 text-slate-500" />
                  </div>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="block w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value="English">English</option>
                    <option value="Traditional Chinese">繁體中文</option>
                    <option value="Simplified Chinese">Simplified Chinese</option>
                    <option value="Japanese">日本語</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* Region Selector */}
                <div className="relative group min-w-[160px]">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-4 w-4 text-slate-500" />
                  </div>
                  <select 
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="block w-full pl-9 pr-8 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all appearance-none cursor-pointer shadow-sm text-sm"
                  >
                    <option value="United States">United States</option>
                    <option value="Global">Global</option>
                    <option value="Hong Kong">Hong Kong</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="India">India</option>
                    <option value="Brazil">Brazil</option>
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {/* Industry Search */}
                <div className="relative group w-full sm:w-64">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-500 group-focus-within:text-brand-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all shadow-sm text-sm"
                    placeholder="Industry (e.g., Crypto)"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>

                <button 
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white font-medium rounded-xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                  Generate
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {currentView === 'discover' && !loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             <StatCard label="Analyzed Posts" value={totalPosts.toString()} icon={Database} color="text-brand-500" />
             <StatCard label="Saved to Database" value={savedPostsCount.toString()} icon={Sparkles} color="text-yellow-500" />
             <StatCard label="Avg. Shares (3d)" value={`${(Number(avgShares)/1000).toFixed(0)}k`} trend="12% vs last week" trendUp={true} icon={Filter} color="text-green-500" />
             <StatCard label="Top Platform" value="TikTok" trend="Dominating" trendUp={true} icon={RefreshCw} color="text-pink-500" />
          </div>
        )}

        {renderContent()}
        
      </main>
    </div>
  );
};

export default App;