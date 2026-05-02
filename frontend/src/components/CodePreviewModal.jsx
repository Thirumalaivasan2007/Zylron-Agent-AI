import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Play, Code, Edit3, RefreshCw } from 'lucide-react';

const CodePreviewModal = ({ isOpen, onClose, code: initialCode }) => {
    const [code, setCode] = useState(initialCode);
    const [isEditMode, setIsEditMode] = useState(false);

    useEffect(() => {
        setCode(initialCode);
    }, [initialCode]);

    if (!isOpen) return null;

    // Smart Sandbox Logic: If the code is a full HTML document, use it as is.
    // Otherwise, wrap it in our premium responsive boilerplate.
    const isFullHtml = code.trim().toLowerCase().startsWith('<!doctype') || code.trim().toLowerCase().startsWith('<html');
    const isIframe = code.trim().toLowerCase().startsWith('<iframe');

    const srcDoc = isFullHtml || isIframe ? code : `
        <!DOCTYPE html>
        <html>
            <head>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { font-family: sans-serif; background: #fff; color: #333; padding: 20px; margin: 0; }
                </style>
            </head>
            <body>
                <div id="root">${code}</div>
                <script>
                    window.onerror = function(msg, url, line) {
                        const div = document.createElement('div');
                        div.style.color = 'red';
                        div.style.padding = '10px';
                        div.style.background = '#ffebee';
                        div.style.fontSize = '12px';
                        div.innerText = 'Zylron Runtime Error: ' + msg + ' (Line ' + line + ')';
                        document.body.prepend(div);
                    }
                </script>
            </body>
        </html>
    `;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative w-full max-w-7xl h-[92vh] bg-white dark:bg-[#020617] border border-gray-200 dark:border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-in zoom-in-95 duration-500">
                {/* Header: Premium Glassmorphism */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-800/50 flex justify-between items-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-400 to-cyan-600 rounded-2xl text-white shadow-lg shadow-cyan-500/20">
                            <Play size={20} className="fill-current" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">Zylron Hyper-Sandbox</h2>
                            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em] mt-1 opacity-90">Live Interactive Execution Environment</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsEditMode(!isEditMode)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isEditMode ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-slate-400 hover:bg-amber-500/10'}`}
                        >
                            {isEditMode ? <RefreshCw size={14} className="animate-spin-slow" /> : <Edit3 size={14} />}
                            {isEditMode ? 'Running Live...' : 'Edit Code'}
                        </button>
                        <button onClick={onClose} className="p-3 rounded-full hover:bg-red-500/10 text-gray-400 hover:text-red-500 transition-all active:scale-95"><X size={24} /></button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden bg-slate-50 dark:bg-black">
                    {/* Editor Panel: Darker, more focused */}
                    {isEditMode && (
                        <div className="w-[400px] border-r border-gray-100 dark:border-gray-800/50 flex flex-col bg-white dark:bg-slate-950/80 backdrop-blur-md">
                            <div className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800/50 bg-gray-50/50 dark:bg-black/20">Source Matrix</div>
                            <textarea 
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="flex-1 w-full bg-transparent p-6 text-sm font-mono text-gray-700 dark:text-cyan-100/80 focus:outline-none resize-none spellcheck-false leading-relaxed"
                                spellCheck="false"
                            />
                        </div>
                    )}

                    {/* Preview Panel: Full viewport focus */}
                    <div className="flex-1 relative bg-white overflow-hidden">
                        <iframe 
                            title="Zylron Live Preview"
                            srcDoc={srcDoc}
                            className="w-full h-full border-none bg-white"
                            sandbox="allow-scripts"
                        />
                    </div>
                </div>

                {/* Footer: Diagnostic Bar */}
                <div className="px-6 py-4 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800/50 flex justify-between items-center">
                    <div className="flex items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-emerald-500"><Code size={12} /> Runtime: V8 Secure</span>
                        <span className="flex items-center gap-2 text-cyan-400"><RefreshCw size={12} /> Hot Reload Active</span>
                        <span className="hidden sm:inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md">Status: Optimized</span>
                    </div>
                    <button onClick={() => {
                        const win = window.open('', '_blank');
                        win.document.write(srcDoc);
                    }} className="px-4 py-2 rounded-xl text-[10px] font-black text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-all flex items-center gap-2 group">
                        Deploy to External Tab <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CodePreviewModal;
