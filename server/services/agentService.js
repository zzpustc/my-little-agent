// server/services/agentService.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * 核心 Agent 函数
 * @param {string} prompt 用户的问题
 * @param {Array} history 历史对话上下文
 * @returns {string} AI 的回答
 */
async function callAgent(prompt, history) {
  // ---【未来扩展点】---
  // 在这里，您可以加入：
  // 1. 意图识别 (Router)
  // 2. 搜索外部知识库 (RAG)
  // 3. 调用亚马逊 API 工具
  // ------------------

  // 1. 整理历史记录格式 (Gemini 格式要求)
  const chatHistory = history.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // 2. 启动对话
  const chat = model.startChat({
    history: chatHistory,
  });

  // 3. 发送消息
  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}

module.exports = { callAgent };