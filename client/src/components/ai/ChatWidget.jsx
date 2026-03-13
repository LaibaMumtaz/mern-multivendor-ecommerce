import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, X, Bot, User, ArrowRight } from 'lucide-react';
import API from '../../api/axios';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([
        { role: 'assistant', text: 'Hello! I am your AI assistant. How can I help you today?' }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { role: 'user', text: message };
        setChat([...chat, userMsg]);
        setMessage('');
        setLoading(true);

        try {
            const { data } = await API.post('/ai/chat', { message });
            setChat((prev) => [...prev, { role: 'assistant', text: data.reply, products: data.products }]);
        } catch (err) {
            setChat((prev) => [...prev, { role: 'assistant', text: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { label: '🛍️ Shop Now', query: 'Show me the latest products' },
        { label: '📦 My Orders', query: 'Where is my order?' },
        { label: '🔥 Hot Deals', query: 'Are there any discounts?' },
        { label: '💬 Support', query: 'I need human help' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-[100] group">
            {/* Pulsing Aura */}
            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse duration-[3000ms]"></div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative z-10 w-16 h-16 rounded-[2rem] shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-gray-900 text-white rotate-90'
                    : 'bg-gradient-to-br from-indigo-600 to-violet-700 text-white'
                    }`}
            >
                {isOpen ? <X size={28} /> : <div className="relative"><Bot size={32} className="animate-in zoom-in duration-500" /><span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></span></div>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-24 right-0 w-[400px] max-w-[calc(100vw-2rem)] h-[650px] max-h-[calc(100vh-160px)] bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-gray-100/50 animate-in slide-in-from-bottom-10 fade-in duration-500">

                    {/* Premium Header */}
                    <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30 shadow-inner">
                                    <Bot size={32} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-xl tracking-tight">Marketplace Concierge</h3>
                                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/30">Live</span>
                                    </div>
                                    <p className="text-sm text-indigo-100 font-medium opacity-80">Always here to help you shop better.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X size={20} /></button>
                        </div>

                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl -translate-x-1/2 translate-y-1/2"></div>
                    </div>

                    {/* Chat Feed */}
                    <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                        {chat.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] px-5 py-4 rounded-[1.8rem] text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-100 font-medium'
                                    : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none border-b-2 border-b-gray-200/50'
                                    }`}>
                                    <p>{msg.text}</p>

                                    {/* Dynamic Product Cards */}
                                    {msg.products && msg.products.length > 0 && (
                                        <div className="mt-4 grid grid-cols-1 gap-3">
                                            {msg.products.map(p => (
                                                <Link
                                                    key={p._id}
                                                    to={`/products/${p._id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className="bg-gray-50/50 border border-gray-100 p-3 rounded-2xl flex items-center gap-4 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group/card"
                                                >
                                                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-sm">
                                                        <img src={p.images[0]} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                                                    </div>
                                                    <div className="flex-grow min-w-0">
                                                        <h4 className="text-[11px] font-black text-gray-900 truncate uppercase tracking-tight">{p.name}</h4>
                                                        <p className="text-xs text-indigo-600 font-black mt-0.5">${p.price}</p>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover/card:bg-indigo-600 group-hover/card:text-white transition-colors">
                                                        <ArrowRight size={14} />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Quick Action Suggestions */}
                        {chat.length === 1 && !loading && (
                            <div className="pt-2 grid grid-cols-1 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 ml-1">Suggested for you</p>
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((action, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setMessage(action.query)}
                                            className="px-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-600 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 active:scale-95"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-start items-center gap-4">
                                <div className="bg-white px-5 py-4 rounded-[1.8rem] rounded-tl-none border border-gray-100 shadow-sm flex gap-1.5">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium Input Area */}
                    <div className="p-6 bg-white border-t border-gray-100/50 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)]">
                        <form onSubmit={handleSend} className="relative flex items-center bg-gray-50 p-2 rounded-[2rem] border border-gray-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-200 transition-all duration-300">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-grow bg-transparent border-none px-6 py-3 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                disabled={!message.trim() || loading}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${message.trim() && !loading
                                    ? 'bg-indigo-600 text-white shadow-indigo-200 hover:scale-110 active:scale-95'
                                    : 'bg-gray-200 text-gray-400 shadow-none'
                                    }`}
                            >
                                <Send size={20} className={message.trim() && !loading ? 'translate-x-0.5 -translate-y-0.5' : ''} />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
