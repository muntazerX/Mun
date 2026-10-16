import React, { useRef, useEffect, useState } from 'react';
import { soundEngine } from '../utils/audio';
import { 
  Send, 
  Sparkles, 
  Compass, 
  Flame, 
  Swords, 
  MessageSquare, 
  Search, 
  Coffee,
  RotateCcw
} from 'lucide-react';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

interface ChatViewProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSendMessage: (text: string) => void;
  onUndoLastTurn?: () => void;
  hasUndo?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  isGenerating,
  onSendMessage,
  onUndoLastTurn,
  hasUndo
}) => {
  const [inputText, setInputText] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Generation timer
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isGenerating) return;
    soundEngine.playClick();
    onSendMessage(text);
    setInputText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleQuickAction = (actionText: string) => {
    if (isGenerating) return;
    soundEngine.playClick();
    onSendMessage(actionText);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Helper to format narrative text & render dice roll badge cleanly
  const formatNarrative = (raw: string) => {
    // Strip JSON blocks
    let clean = raw.replace(/```json[\s\S]*?```/g, '').replace(/```[\s\S]*?```/g, '').trim();

    // Match dice roll patterns
    const diceMatch = clean.match(/🎲?\s*نرد القدر[:\s]*\[?(\d+)\/100\]?[^\n]*/i);
    let diceBadge: React.ReactNode = null;

    if (diceMatch) {
      const roll = parseInt(diceMatch[1], 10);
      let grade = 'عادي';
      let badgeBg = 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300';
      if (roll <= 30) {
        grade = 'كارثي 💀';
        badgeBg = 'bg-red-950/80 border-red-800 text-red-300';
      } else if (roll <= 50) {
        grade = 'قاسٍ 😰';
        badgeBg = 'bg-amber-950/80 border-amber-800 text-amber-300';
      } else if (roll <= 65) {
        grade = 'بيثوري 😐';
        badgeBg = 'bg-yellow-950/60 border-yellow-800 text-yellow-300';
      } else if (roll <= 85) {
        grade = 'عادي 🙂';
        badgeBg = 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300';
      } else {
        grade = 'مثالي 🌟';
        badgeBg = 'bg-cyan-950/80 border-cyan-700 text-cyan-200';
      }

      diceBadge = (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-mono font-bold mb-3 shadow-md ${badgeBg}`}>
          <span>🎲 نرد القدر: [{roll}/100]</span>
          <span className="opacity-80">·</span>
          <span>{grade}</span>
        </div>
      );

      // Remove the raw dice line from text so it doesn't duplicate
      clean = clean.replace(/🎲?\s*نرد القدر[:\s]*\[?(\d+)\/100\]?[^\n]*\n?/i, '').trim();
    }

    return (
      <div>
        {diceBadge}
        <div className="whitespace-pre-wrap leading-relaxed font-serif text-sm md:text-[15px] text-[#e0d4c0]">
          {clean}
        </div>
      </div>
    );
  };

  const quickActions = [
    { label: 'استكشاف المحيط', icon: <Search className="w-3.5 h-3.5 text-amber-400" />, prompt: 'استكشف المكان والمنطقة المحيطة بي بحذر بحثاً عن أي علامات أو معالم' },
    { label: 'إشعال نار واستراحة', icon: <Flame className="w-3.5 h-3.5 text-orange-400" />, prompt: 'أبحث عن مأوى آمن، أشعل ناراً خفيفة وأستريح لاستعادة طاقتي وتركيزي' },
    { label: 'تحدث مع المارة', icon: <MessageSquare className="w-3.5 h-3.5 text-blue-400" />, prompt: 'أقترب من السكان أو المسافرين القريبين وأسألهم عن أخبار الممالك وأوضاع الطرق' },
    { label: 'تفقد العتاد والمؤن', icon: <Swords className="w-3.5 h-3.5 text-red-400" />, prompt: 'أتفقد نصل سلاحي ودرعي وأتحقق من رصيد طعامي وماء قربتي' },
    { label: 'فحص طرق السفر', icon: <Compass className="w-3.5 h-3.5 text-emerald-400" />, prompt: 'ما هي الطرق والمدن المتصلة بموقعي الحالي والمسافات إليها؟' }
  ];

  return (
    <div className="relative flex-1 flex flex-col h-full min-h-0 bg-[#0a0a0c]">
      {/* Messages Stream */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-start' : 'items-end'
            }`}
          >
            <div
              className={`relative max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 shadow-xl border ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-[#121c12] to-[#0c140c] border-[#2a402a] text-[#d8e8d8] rounded-tr-sm border-r-4 border-r-emerald-500'
                  : msg.role === 'system'
                  ? 'bg-neutral-900/60 border-neutral-800 text-neutral-400 text-xs italic mx-auto text-center'
                  : 'bg-gradient-to-br from-[#171410] to-[#100d0a] border-[#382d20] text-[#e8d8c0] rounded-tl-sm border-l-4 border-l-amber-600'
              }`}
            >
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap leading-relaxed text-xs md:text-sm">
                  {msg.content}
                </div>
              ) : (
                formatNarrative(msg.content)
              )}
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isGenerating && (
          <div className="flex flex-col items-end">
            <div className="bg-[#171410] border border-amber-900/40 rounded-2xl rounded-tl-sm p-4 flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[11px] font-mono text-amber-600">
                جاري التفكير والتوليد ({elapsedTime} ثانية)...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Pills */}
      <div className="px-3 py-1.5 bg-neutral-950/90 border-t border-neutral-900 overflow-x-auto flex items-center gap-2 select-none no-scrollbar">
        {quickActions.map((action, i) => (
          <button
            key={i}
            disabled={isGenerating}
            onClick={() => handleQuickAction(action.prompt)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-[11px] text-neutral-300 hover:text-amber-300 hover:border-amber-700/60 whitespace-nowrap transition-all cursor-pointer disabled:opacity-50"
          >
            {action.icon}
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 bg-neutral-950 border-t border-amber-950/40">
        <div className="relative flex items-end gap-2 bg-neutral-900/90 border border-neutral-800 focus-within:border-amber-600/70 rounded-2xl p-2 transition-all shadow-inner">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="اكتب أمرك أو قرارك هنا... (مثال: أتوجه إلى السوق، أسحب سيفي، أسأل عن الطريق)"
            rows={1}
            disabled={isGenerating}
            className="flex-1 bg-transparent border-0 text-sm md:text-[15px] font-serif text-neutral-200 placeholder:text-neutral-500 outline-none resize-none max-h-32 p-1.5 leading-relaxed"
          />

          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isGenerating}
            className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shrink-0 shadow-md active:scale-95"
            title="إرسال (Enter)"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
