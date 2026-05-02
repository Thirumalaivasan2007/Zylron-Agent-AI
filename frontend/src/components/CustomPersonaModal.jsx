import React, { useState } from 'react';
import { X, Save, Sparkles, UserPlus, Zap } from 'lucide-react';

const CustomPersonaModal = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [instructions, setInstructions] = useState('');
    const [tone, setTone] = useState('Professional');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name || !instructions) return;
        onSave({ name, role, instructions, tone });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#020617] border border-gray-200 dark:border-cyan-500/30 rounded-[3rem] shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Background Accent Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="p-10">
                    {/* Header */}
                    <div className="flex items-center gap-6 mb-10">
                        <div className="p-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-3xl text-white shadow-xl shadow-cyan-500/20">
                            <Sparkles size={28} className="animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none">Persona Architect</h2>
                            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em] mt-2 opacity-80">Synthesize Custom Intelligence Modules</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Persona Alias</label>
                                <div className="relative group">
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. JARVIS / CYBERPUNK"
                                        className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800/50 rounded-2xl p-4 text-sm dark:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-700"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/30 group-focus-within:text-cyan-500 transition-colors">
                                        <Zap size={16} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Cognitive Tone</label>
                                <select 
                                    value={tone}
                                    onChange={(e) => setTone(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800/50 rounded-2xl p-4 text-sm dark:text-cyan-50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 appearance-none cursor-pointer"
                                >
                                    <option>Professional</option>
                                    <option>Sarcastic</option>
                                    <option>Aggressive</option>
                                    <option>Friendly</option>
                                    <option>Mysterious</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Primary Directive</label>
                            <textarea 
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="Define the rules, behavior, and mission constraints for this entity..."
                                className="w-full bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-gray-800/50 rounded-3xl p-5 text-sm dark:text-cyan-50/80 h-40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-700"
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-8 py-4 bg-gray-100 dark:bg-slate-900 text-gray-500 dark:text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-500/10 hover:text-red-500 transition-all"
                            >
                                Abort
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={!name || !instructions}
                                className="flex-[2] px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                            >
                                <Save size={18} /> Initialize Neural Persona
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomPersonaModal;
