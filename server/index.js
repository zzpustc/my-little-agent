// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Session = require('./models/Session');
const { callAgent } = require('./services/agentService');

const app = express();
app.use(cors()); // 允许前端访问
app.use(express.json());

// 连接数据库
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB 连接成功！');
  })
  .catch(err => {
    console.error('❌ MongoDB 连接失败！错误详情：');
    console.error(err);
  });

// --- API 路由 ---

// 1. 获取所有会话列表 (侧边栏用)
app.get('/api/sessions', async (req, res) => {
  const sessions = await Session.find().select('title updatedAt').sort({ updatedAt: -1 });
  res.json(sessions);
});

// 2. 获取单个会话详情 (点击侧边栏时用)
app.get('/api/sessions/:id', async (req, res) => {
  const session = await Session.findById(req.params.id);
  res.json(session);
});

// 3. 新建会话
app.post('/api/sessions', async (req, res) => {
  const newSession = new Session({ title: '新对话' });
  await newSession.save();
  res.json(newSession);
});

// 4. 发送消息 (核心交互)
app.post('/api/chat', async (req, res) => {
  const { sessionId, content } = req.body;

  try {
    // A. 获取会话
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // B. 保存用户提问
    session.messages.push({ role: 'user', content });
    
    // C. 调用 Agent (传入历史记录)
    // 注意：这里只传最近的几轮对话以节省 Token
    const aiResponseText = await callAgent(content, session.messages.slice(-10));

    // D. 保存 AI 回答
    session.messages.push({ role: 'ai', content: aiResponseText });
    
    // E. 如果是第一句，自动更新标题
    if (session.messages.length <= 2) {
      session.title = content.substring(0, 20);
    }
    session.updatedAt = new Date();
    await session.save();

    // F. 返回给前端
    res.json({ response: aiResponseText, messages: session.messages });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
