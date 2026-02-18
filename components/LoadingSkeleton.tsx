import React from 'react';

export const GridSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[420px] animate-pulse shadow-sm">
      {/* Header: Platform + Region + Bookmark */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2">
            <div className="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
            <div className="w-16 h-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
        </div>
        <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-md"></div>
      </div>

      {/* Title */}
      <div className="w-full h-7 bg-slate-100 dark:bg-slate-800 rounded-lg mb-2"></div>
      <div className="w-2/3 h-7 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4"></div>
      
      {/* Hook Box */}
      <div className="w-full h-20 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4 border border-slate-100 dark:border-slate-800"></div>

      {/* Description */}
      <div className="space-y-2 mb-4 flex-grow">
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
          <div className="w-3/4 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-4">
         <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
         <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
         <div className="w-10 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
      </div>
      
      {/* Source Link Stub */}
      <div className="w-full h-12 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4 border-t border-slate-100 dark:border-slate-800/50"></div>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
         <div className="flex gap-4">
             <div className="flex flex-col gap-1">
                 <div className="w-12 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                 <div className="w-16 h-5 bg-slate-100 dark:bg-slate-800 rounded"></div>
             </div>
             <div className="flex flex-col gap-1">
                 <div className="w-10 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                 <div className="w-10 h-5 bg-slate-100 dark:bg-slate-800 rounded"></div>
             </div>
         </div>
         <div className="flex flex-col items-end gap-1">
            <div className="w-8 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
            <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
         </div>
      </div>
      
      {/* Trigger Badge */}
      <div className="mt-3 w-full h-6 bg-slate-100 dark:bg-slate-800 rounded"></div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl animate-pulse">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4"><div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div></th>
              <th scope="col" className="px-6 py-4"><div className="w-20 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div></th>
              <th scope="col" className="px-6 py-4 text-center"><div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></th>
              <th scope="col" className="px-6 py-4"><div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div></th>
              <th scope="col" className="px-6 py-4 text-center"><div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></th>
              <th scope="col" className="px-6 py-4 text-center"><div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="bg-white dark:bg-slate-900">
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 max-w-xs">
                    <div className="w-3/4 h-5 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="flex gap-2 mt-1">
                        <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                        <div className="w-12 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 h-6 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2 items-center">
                    <div className="w-16 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div className="w-12 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-2">
                     <div className="w-24 h-4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                     <div className="w-16 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Default export for backward compatibility if needed, but we prefer named
const LoadingSkeleton = GridSkeleton;
export default LoadingSkeleton;