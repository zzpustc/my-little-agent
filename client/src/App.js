// // client/src/App.js
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import ReactMarkdown from 'react-markdown'; // 用于渲染 Markdown
// import { FaPlus, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
// import './App.css';

// const API_BASE = 'http://localhost:5000/api';

// function App() {
//   const [sessions, setSessions] = useState([]);
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // 1. 加载历史会话列表
//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   // 2. 滚动到底部
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const fetchSessions = async () => {
//     const res = await axios.get(`${API_BASE}/sessions`);
//     setSessions(res.data);
//   };

//   // 3. 切换会话
//   const loadSession = async (id) => {
//     setCurrentSessionId(id);
//     const res = await axios.get(`${API_BASE}/sessions/${id}`);
//     setMessages(res.data.messages);
//   };

//   // 4. 新建对话
//   const createNewSession = async () => {
//     const res = await axios.post(`${API_BASE}/sessions`);
//     setSessions([res.data, ...sessions]);
//     setCurrentSessionId(res.data._id);
//     setMessages([]);
//   };

//   // 5. 发送消息
//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     if (loading) return;

//     let sessionId = currentSessionId;

//     // 如果当前没有会话，先创建一个
//     if (!sessionId) {
//       const res = await axios.post(`${API_BASE}/sessions`);
//       sessionId = res.data._id;
//       setCurrentSessionId(sessionId);
//       setSessions([res.data, ...sessions]);
//     }

//     // UI 立即更新显示用户问题
//     const userMsg = { role: 'user', content: input };
//     setMessages(prev => [...prev, userMsg]);
//     setInput('');
//     setLoading(true);

//     try {
//       // 发送给后端
//       const res = await axios.post(`${API_BASE}/chat`, {
//         sessionId: sessionId,
//         content: userMsg.content
//       });

//       // 更新 AI 回复
//       // 后端直接返回了最新完整的 messages 数组，或者只返回最新回复，这里为了简单直接取后端的 messages
//       setMessages(res.data.messages);
      
//       // 刷新列表（因为标题可能变了）
//       fetchSessions();
//     } catch (error) {
//       console.error(error);
//       alert('发送失败，请检查后端');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app-container">
//       {/* --- 左侧边栏 --- */}
//       <div className="sidebar">
//         <button className="new-chat-btn" onClick={createNewSession}>
//           <FaPlus /> 新对话
//         </button>
//         <div className="history-list">
//           {sessions.map(session => (
//             <div 
//               key={session._id} 
//               className={`history-item ${currentSessionId === session._id ? 'active' : ''}`}
//               onClick={() => loadSession(session._id)}
//             >
//               {session.title}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* --- 右侧聊天区 --- */}
//       <div className="chat-area">
//         <div className="messages-container">
//           {messages.length === 0 && (
//             <div style={{textAlign: 'center', marginTop: '20%', color: '#666'}}>
//               <h2>Gemini Agent</h2>
//               <p>有什么可以帮你的吗？</p>
//             </div>
//           )}
          
//           {messages.map((msg, idx) => (
//             <div key={idx} className={`message ${msg.role}`}>
//               <div className="message-content" style={{ display: 'flex', gap: '15px' }}>
//                 <div style={{minWidth: '30px'}}>
//                   {msg.role === 'ai' ? <FaRobot size={20}/> : <FaUser size={20}/>}
//                 </div>
//                 {/* 使用 ReactMarkdown 渲染 AI 的回答 (支持代码块等) */}
//                 <div style={{width: '100%'}}>
//                   {msg.role === 'ai' ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
//                 </div>
//               </div>
//             </div>
//           ))}
//           {loading && <div className="message ai">正在思考...</div>}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* 底部输入框 */}
//         <div className="input-container">
//           <div className="input-box">
//             <input 
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === 'Enter' && sendMessage()}
//               placeholder="发送消息..." 
//             />
//             <button onClick={sendMessage}><FaPaperPlane /></button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;



import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
// --- 新增引入 ---
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 引入一款类似 VSCode 的深色主题
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; 
import remarkGfm from 'remark-gfm';
// ----------------
import { FaPlus, FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import './App.css';

const API_BASE = 'https://gemini-backend-flvn.onrender.com';

function App() {
  // ... (中间的状态逻辑 useState, useEffect, sendMessage 等完全不变，保持原样) ...
  // ... 这里省略重复代码，直接跳到 return 部分 ...

  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // ... (请保留之前的 fetchSessions, loadSession, createNewSession, sendMessage 函数) ...
  // 为了方便您复制，这里假设您保留了之前的逻辑代码
  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  const fetchSessions = async () => { const res = await axios.get(`${API_BASE}/sessions`); setSessions(res.data); };
  const loadSession = async (id) => { setCurrentSessionId(id); const res = await axios.get(`${API_BASE}/sessions/${id}`); setMessages(res.data.messages); };
  const createNewSession = async () => { const res = await axios.post(`${API_BASE}/sessions`); setSessions([res.data, ...sessions]); setCurrentSessionId(res.data._id); setMessages([]); };
  const sendMessage = async () => {
      if (!input.trim() || loading) return;
      let sessionId = currentSessionId;
      if (!sessionId) {
        const res = await axios.post(`${API_BASE}/sessions`);
        sessionId = res.data._id;
        setCurrentSessionId(sessionId);
        setSessions([res.data, ...sessions]);
      }
      const userMsg = { role: 'user', content: input };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);
      try {
        const res = await axios.post(`${API_BASE}/chat`, { sessionId: sessionId, content: userMsg.content });
        setMessages(res.data.messages);
        fetchSessions();
      } catch (error) { console.error(error); alert('发送失败'); } finally { setLoading(false); }
  };

  return (
    <div className="app-container">
      {/* 侧边栏保持不变 */}
      <div className="sidebar">
        <button className="new-chat-btn" onClick={createNewSession}><FaPlus /> 新对话</button>
        <div className="history-list">
          {sessions.map(session => (
            <div key={session._id} className={`history-item ${currentSessionId === session._id ? 'active' : ''}`} onClick={() => loadSession(session._id)}>
              {session.title}
            </div>
          ))}
        </div>
      </div>

      {/* 聊天区 */}
      <div className="chat-area">
        <div className="messages-container">
          {messages.length === 0 && (
            <div style={{textAlign: 'center', marginTop: '20%', color: '#666'}}>
              <h2>Gemini Agent</h2><p>有什么可以帮你的吗？</p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="message-content" style={{ display: 'flex', gap: '15px' }}>
                <div style={{minWidth: '30px', paddingTop: '5px'}}>
                  {msg.role === 'ai' ? <FaRobot size={20} color="#10a37f"/> : <FaUser size={20} color="#aaa"/>}
                </div>
                
                {/* ★★★ 核心修改区域 ★★★ */}
                <div style={{width: '100%', overflow: 'hidden'}}>
                  {msg.role === 'ai' ? (
                    <ReactMarkdown
                      // 1. 启用 GFM 插件 (支持表格、删除线等)
                      remarkPlugins={[remarkGfm]}
                      
                      // 2. 自定义渲染组件
                      components={{
                        // (A) 代码块高亮逻辑
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={vscDarkPlus} // 使用 VSCode 深色主题
                              language={match[1]} // 自动识别语言 (js, python, etc.)
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            // 这里是行内代码 (如 `const a = 1`)
                            <code className={className} style={{background: '#3a3a3a', padding: '2px 4px', borderRadius: '4px'}} {...props}>
                              {children}
                            </code>
                          )
                        },
                        // (B) 图片渲染逻辑
                        img({node, ...props}) {
                           return (
                             <img 
                               {...props} 
                               style={{maxWidth: '100%', borderRadius: '8px', marginTop: '10px'}} 
                               alt={props.alt || 'Agent Image'}
                             />
                           );
                        }
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    // 用户消息保持纯文本即可，或者也用 Markdown
                    <div style={{whiteSpace: 'pre-wrap'}}>{msg.content}</div>
                  )}
                </div>
                {/* ★★★ 修改结束 ★★★ */}

              </div>
            </div>
          ))}
          {loading && <div className="message ai"><div className="message-content">AI 正在思考...</div></div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-box">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="发送消息..." />
            <button onClick={sendMessage}><FaPaperPlane /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
