import { useState, useEffect } from "react";
import { contactAPI } from "../../services/api";
import { ArrowLeft, Mail, Trash2, CheckCheck, MessageSquare, Loader2 } from "lucide-react";

export default function ContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMessages(); }, []);
  const loadMessages = () => {
    setLoading(true);
    contactAPI.getAll().then((res) => { setMessages(res.data); setLoading(false); });
  };

  const handleMarkRead = async (id) => { await contactAPI.markRead(id); loadMessages(); };
  const handleDelete = async (id) => { if (!window.confirm("Delete this message?")) return; await contactAPI.delete(id); loadMessages(); };
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div>
      <button onClick={() => window.history.back()} className="flex items-center gap-2 text-gray-500 text-[0.8rem] hover:text-white transition-colors mb-6">
        <ArrowLeft size={14} /> Back
      </button>
      <div className="flex items-center gap-3 mb-8">
        <h1 className="font-heading text-[2.2rem] tracking-[2px] uppercase text-white leading-none">Messages</h1>
        {unreadCount > 0 && (
          <span className="px-2.5 py-0.5 bg-red/15 text-red text-[0.7rem] font-bold uppercase tracking-[1px] rounded-full">{unreadCount} unread</span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]"><Loader2 size={24} className="text-red animate-spin" /></div>
      ) : messages.length === 0 ? (
        <div className="bg-[#111113] border border-white/[0.06] rounded-lg p-12 text-center">
          <MessageSquare size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-600 text-[0.85rem]">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div key={msg._id} className={`bg-[#111113] border rounded-lg overflow-hidden transition-all duration-200 hover:border-white/[0.1] ${msg.read ? "border-white/[0.06]" : "border-red/20"}`}>
              {/* Header */}
              <div className="px-6 py-4 flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {!msg.read && <div className="w-2 h-2 rounded-full bg-red flex-shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[0.85rem] font-semibold text-gray-200">{msg.name}</span>
                      <span className="text-[0.75rem] text-gray-600">{msg.email}</span>
                    </div>
                    {msg.subject && <div className="text-[0.75rem] text-red font-medium mt-0.5">{msg.subject}</div>}
                  </div>
                </div>
                <span className="text-[0.7rem] text-gray-600 flex-shrink-0 ml-4">
                  {new Date(msg.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  {" "}
                  {new Date(msg.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {/* Body */}
              <div className="px-6 pb-4">
                <p className="text-[0.85rem] text-gray-400 leading-relaxed">{msg.message}</p>
              </div>

              {/* Actions */}
              <div className="px-6 py-3 border-t border-white/[0.04] flex gap-2">
                {!msg.read && (
                  <button onClick={() => handleMarkRead(msg._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold uppercase tracking-[1px] rounded border border-white/[0.06] hover:text-white hover:bg-white/[0.08] transition-all duration-150">
                    <CheckCheck size={12} /> Mark Read
                  </button>
                )}
                <button onClick={() => handleDelete(msg._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] text-gray-400 text-[0.65rem] font-semibold uppercase tracking-[1px] rounded border border-white/[0.06] hover:text-red hover:bg-red/10 transition-all duration-150">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
