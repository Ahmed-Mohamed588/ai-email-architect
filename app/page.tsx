'use client'

import { useState } from 'react';
import { generateEmail } from './actions';
import { Loader2, Copy, Check, Sparkles, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) {
      toast.error("Please describe your email first.");
      return;
    }
    setLoading(true);
    
    const result = await generateEmail(prompt);
    
    if (result.success && result.html) {
      setGeneratedHtml(result.html);
      toast.success("Email generated successfully! 🚀");
    } else {
      toast.error("Failed to generate email. Please try again.");
    }
    
    setLoading(false);
  }

  const handleCopy = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    toast.info("HTML code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Navbar header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Code size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">AI Email Architect</h1>
        </div>
        <div className="text-sm text-slate-500 flex items-center gap-1">
          Powered by <Sparkles size={14} className="text-amber-500" /> Ahmed Mohamed
        </div>
      </header>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden relative">
        
        {/* Left Panel: Editor */}
        <section className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
             <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              ✏️ Describe your Email
             </h2>
          </div>
          <div className="flex-1 p-4 flex flex-col">
            <textarea
              className="flex-1 w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 text-lg placeholder:text-slate-400 transition-all"
              placeholder="e.g. A Welcome email for a SaaS product called 'TaskFlow'. Use a friendly tone, blue primary color, and include a CTA to 'Get Started'."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
             <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white flex items-center justify-center gap-2 transition-all transform active:scale-[0.98]
                ${loading || !prompt.trim() 
                  ? 'bg-slate-400 cursor-not-allowed opacity-80' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
            >
              {loading ? (
                <> <Loader2 size={20} className="animate-spin" /> Generating...</>
              ) : (
                <> <Sparkles size={20} /> Generate Email</>
              )}
            </button>
          </div>
        </section>

        {/* Right Panel: Preview */}
        <section className="w-full lg:w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
           <div className="p-3 border-b border-slate-200 bg-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                👁️ Live Preview
              </h2>
              {generatedHtml && (
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border transition-all
                    ${copied 
                      ? 'bg-green-50 border-green-200 text-green-700' 
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'}`}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy HTML'}
                </button>
              )}
            </div>
            
            <div className="flex-1 bg-slate-50 relative overflow-hidden">
              {generatedHtml ? (
                <iframe
                  title="Email Preview"
                  srcDoc={generatedHtml}
                  className="w-full h-full border-none bg-white shadow-inner"
                  sandbox="allow-same-origin" // Security best practice
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 select-none">
                  <div className="bg-slate-100 p-6 rounded-full mb-4">
                     <Code size={48} className="text-slate-400" />
                  </div>
                  <p className="text-lg font-medium text-slate-400">Your generated email will appear here.</p>
                </div>
              )}
            </div>
        </section>

      </div>
    </main>
  );
}