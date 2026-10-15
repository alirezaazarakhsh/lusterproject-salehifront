import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, X, Send, RefreshCw, AlertTriangle, MessageSquare, Bot, User, CheckCircle2 } from 'lucide-react';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface AIChandelierConsultantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChandelierConsultant: React.FC<AIChandelierConsultantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'سلام! من مشاور هوشمند طراحی نور و لوستر گالری اکبر صالحی هستم. چه نوع فضایی (پذیرایی، لابی، دوبلکس، سالن غذاخوری) با چه ابعاد و سبکی (کلاسیک، مدرن، کریستالی) دارید تا بهترین لوستر با مناسب‌ترین متراژ و تعداد شاخه را به شما پیشنهاد دهم؟',
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [rateExceededState, setRateExceededState] = useState<{ isLimited: boolean; retryAfter: number; message: string }>({
    isLimited: false,
    retryAfter: 0,
    message: ''
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const countdownTimerRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (rateExceededState.isLimited && rateExceededState.retryAfter > 0) {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = window.setInterval(() => {
        setRateExceededState((prev) => {
          if (prev.retryAfter <= 1) {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            return { isLimited: false, retryAfter: 0, message: '' };
          }
          return { ...prev, retryAfter: prev.retryAfter - 1 };
        });
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [rateExceededState.isLimited, rateExceededState.retryAfter]);

  if (!isOpen) return null;

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputQuery;
    if (!textToSend.trim() || isThinking || rateExceededState.isLimited) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend.trim() })
      });

      const data = await res.json();

      if (res.status === 429 || data.rateExceeded || data.error?.includes('Rate exceeded') || data.error?.includes('Quota')) {
        const waitSeconds = data.retryAfter || 15;
        setRateExceededState({
          isLimited: true,
          retryAfter: waitSeconds,
          message: data.error || 'محدودیت تعداد درخواست (Rate Exceeded) اعمال شد. سیستم در حال تلاش مجدد هوشمند است...'
        });
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: `⚠️ سقف تعداد درخواست‌های هوش مصنوعی (Rate Exceeded) موقتاً تکمیل شد. لطفاً ${waitSeconds} ثانیه صبر کنید تا مجدداً متصل شویم.`,
            timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (!res.ok) {
        throw new Error(data.error || 'خطا در ارتباط با هوش مصنوعی گالری صالحی');
      } else {
        const aiMsg: Message = {
          sender: 'ai',
          text: data.reply || 'پاسخی دریافت نشد.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err: any) {
      console.error('AI Consult error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'متأسفانه در برقراری ارتباط با سرویس هوش مصنوعی خطایی رخ داد. لطفاً چند لحظه دیگر دوباره تلاش کنید.',
          timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    'راهنمای انتخاب لوستر برای سالن پذیرایی ۴۰ متری',
    'لوستر مناسب برای سقف بلند دوبلکس چیست؟',
    'تفاوت لوسترهای برنزی و کریستالی کلاسیک',
    'محاسبه تعداد شاخه و لامپ بر اساس متراژ سالن'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] border border-amber-200/50">
        
        {/* هدر مدال مشاور هوشمند */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-amber-100 font-serif">مشاور هوشمند لوستر صالحی</h3>
              <p className="text-xs text-amber-300/80">راهنمای تخصصی طراحی روشنایی با هوش مصنوعی پیشرفته</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* بنر نرخ تجاوز (Rate Exceeded Warning) در صورت وقوع */}
        {rateExceededState.isLimited && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between text-amber-900 text-sm animate-bounce">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>محدودیت نرخ درخواست (Rate Exceeded). تلاش مجدد خودکار تا {rateExceededState.retryAfter} ثانیه دیگر...</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-amber-700 bg-amber-200/60 px-3 py-1 rounded-full text-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{rateExceededState.retryAfter} ثانیه</span>
            </div>
          </div>
        )}

        {/* بدنه چت */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-stone-50/50 to-amber-50/20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-900 text-amber-400 border border-amber-500/30'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tl-none font-medium'
                    : 'bg-white text-stone-800 rounded-tr-none border border-stone-200/80 font-normal'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div
                  className={`text-[10px] mt-1.5 text-left ${
                    msg.sender === 'user' ? 'text-amber-100' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 animate-spin text-amber-400" />
              </div>
              <div className="bg-white text-stone-600 rounded-2xl rounded-tr-none border border-stone-200/80 px-4 py-3 text-sm shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping [animation-delay:0.4s]"></div>
                <span className="mr-2 font-medium text-amber-900">مشاور هوشمند در حال تحلیل و آماده‌سازی پاسخ...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* سوالات سریع پیشنهادی */}
        <div className="px-4 py-2 bg-stone-100/80 border-t border-stone-200/60 flex gap-2 overflow-x-auto scrollbar-none">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(undefined, q)}
              disabled={isThinking || rateExceededState.isLimited}
              className="whitespace-nowrap px-3 py-1.5 bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 text-xs rounded-full border border-stone-200 shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              ✨ {q}
            </button>
          ))}
        </div>

        {/* فیلد ورودی پیام */}
        <form onSubmit={(e) => handleSendMessage(e)} className="p-4 bg-white border-t border-stone-200 flex items-center gap-3">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={rateExceededState.isLimited ? 'لطفاً تا پایان زمان محدودیت صبر کنید...' : 'سوال خود را درباره انتخاب لوستر، متراژ یا سبک دکوراسیون بپرسید...'}
            disabled={rateExceededState.isLimited}
            className="flex-1 bg-stone-100 border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isThinking || rateExceededState.isLimited}
            className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-xl font-medium text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <span>ارسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>

      </div>
    </div>
  );
};
