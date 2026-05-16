import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { sendChatMessage } from '../api/claude';
import { useLang } from '../context/LangContext';

const KisanChat = ({ context }) => {
  const { t } = useLang();
  const [messages, setMessages] = useState([
    { role: 'ai', content: `Namaste! I am your KisanAI advisor. I see you are growing ${context.crop} in ${context.region}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs); setInput(''); setIsTyping(true);
    const resp = await sendChatMessage(newMsgs, context);
    setMessages([...newMsgs, { role: 'ai', content: resp }]); setIsTyping(false);
  };

  const toggleRec = () => {
    if (isRecording) { setIsRecording(false); return; }
    setIsRecording(true);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SR) {
      const r = new SR(); r.lang = 'hi-IN'; r.continuous = false; r.interimResults = false;
      r.onresult = (e) => { setInput(e.results[0][0].transcript); setIsRecording(false); };
      r.onerror = () => setIsRecording(false);
      r.start();
    } else { alert('Speech not supported'); setIsRecording(false); }
  };

  return (
    <div className="main-content" style={{padding:'.5rem'}}>
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((m,i) => <div key={i} className={`message ${m.role}`}>{m.content}</div>)}
          {isTyping && <div className="message ai" style={{opacity:.7}}>...</div>}
          <div ref={endRef}/>
        </div>
        <div className="chat-input-area">
          <button className={`btn-icon ${isRecording?'recording':''}`} onClick={toggleRec}><Mic size={20}/></button>
          <input type="text" className="chat-input" placeholder={t('chatPlaceholder')} value={input} onChange={e=>setInput(e.target.value)} onKeyPress={e=>e.key==='Enter'&&handleSend()}/>
          <button className="btn-icon" onClick={handleSend}><Send size={20}/></button>
        </div>
      </div>
    </div>
  );
};
export default KisanChat;
