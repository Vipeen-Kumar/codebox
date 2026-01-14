import React, { useState, useContext, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Header, CloseButton } from '../Modal';
import { IoCloseSharp, IoSend, IoCodeSlashOutline, IoTrashOutline } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 500px;
  color: #eaeaea;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #252526;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: ${props => props.isUser ? '#0097d7' : '#3e3e42'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  font-size: 0.95rem;
  line-height: 1.5;
  
  pre {
    background: #1e1e1e !important;
    padding: 0.8rem !important;
    border-radius: 6px !important;
    overflow-x: auto;
  }

  code {
    background: rgba(0,0,0,0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
  }
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  background: #252526;
  border: 1px solid #333;
  color: #eaeaea;
  padding: 0.8rem;
  border-radius: 24px;
  outline: none;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.95rem;

  &:focus {
    border-color: #f59e0b;
  }
`;

const SendButton = styled.button`
  background: #f59e0b;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #1e1e1e;
  font-size: 1.2rem;
  transition: all 0.2s;

  &:hover {
    background: #e08c00;
    transform: scale(1.05);
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
    transform: none;
  }
`;

const CodeContextBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: ${props => props.active ? 'rgba(245, 158, 11, 0.15)' : '#333'};
  border: 1px solid ${props => props.active ? '#f59e0b' : '#444'};
  border-radius: 16px;
  font-size: 0.8rem;
  color: ${props => props.active ? '#f59e0b' : '#aaa'};
  cursor: pointer;
  margin-bottom: 0.5rem;
  align-self: flex-start;
  transition: all 0.2s;

  &:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 0.5rem;
  
  span {
    width: 8px;
    height: 8px;
    background: #b0b0b0;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }
  
  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }
  
  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const ClearButton = styled.button`
  background: transparent;
  border: 1px solid #444;
  color: #aaa;
  padding: 0.4rem 0.8rem;
  border-radius: 16px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 0, 0, 0.1);
    border-color: #ff4d4d;
    color: #ff4d4d;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const AIChat = () => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { chatHistories, updateChatHistory, folders } = useContext(PlaygroundContext);
  const { code: codeContext, language: languageContext, playgroundId, folderId } = isOpenModal.identifiers;

  const playgroundTitle = folders[folderId]?.playgrounds[playgroundId]?.title || 'Unknown Playground';

  const initialMessages = chatHistories[playgroundId] || [
    { role: 'model', text: `Hello! I am your AI assistant for the playground "${playgroundTitle}". I have access to your code and can help you with debugging, explanations, or improvements. How can I help you today?` }
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [includeCode, setIncludeCode] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    updateChatHistory(playgroundId, messages);
  }, [messages, playgroundId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemContext = `Current coding context:
Playground Title: ${playgroundTitle}
Language: ${languageContext}
Current Code:
\`\`\`${languageContext}
${codeContext}
\`\`\`
Please use this context to answer my questions accurately. Mention file/playground names when relevant.`;

      const apiHistory = newMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      // Prepend context to the first user message of the session if includeCode is true
      if (includeCode && codeContext && newMessages.filter(m => m.role === 'user').length === 1) {
        apiHistory[apiHistory.length - 1].parts[0].text = `${systemContext}\n\nUser Question: ${input}`;
      }

      const response = await axios.post('http://localhost:5000/api/ai/chat', {
        prompt: input,
        history: apiHistory.slice(0, -1)
      });

      const aiMessage = { role: 'model', text: response.data.text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  return (
    <>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src="/src/assets/aiicon.png" alt="AI" style={{ width: '24px', height: '24px' }} onError={(e) => {e.target.style.display='none'}} />
            <h2 style={{ color: '#f59e0b', margin: 0 }}>AI Assistant</h2>
        </div>
        <CloseButton onClick={closeModal}>
          <IoCloseSharp />
        </CloseButton>
      </Header>

      <ChatContainer>
        <MessagesArea>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.role === 'user'}>
              {msg.role === 'user' ? (
                msg.text
              ) : (
                <ReactMarkdown
                  children={msg.text}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, '')}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                />
              )}
            </MessageBubble>
          ))}
          {loading && (
            <MessageBubble isUser={false}>
               <LoadingDots><span></span><span></span><span></span></LoadingDots>
            </MessageBubble>
          )}
          <div ref={messagesEndRef} />
        </MessagesArea>

        <ActionsContainer>
          {codeContext && (
            <CodeContextBadge 
              active={includeCode} 
              onClick={() => setIncludeCode(!includeCode)}
            >
              <IoCodeSlashOutline />
              <span>{includeCode ? 'Code Attached' : 'Attach Current Code'}</span>
            </CodeContextBadge>
          )}
          <ClearButton onClick={() => {
            if (window.confirm('Clear conversation history for this playground?')) {
              const resetMessages = [
                { role: 'model', text: `Hello! I am your AI assistant for the playground "${playgroundTitle}". I have access to your code and can help you with debugging, explanations, or improvements. How can I help you today?` }
              ];
              setMessages(resetMessages);
              updateChatHistory(playgroundId, resetMessages);
            }
          }}>
            <IoTrashOutline />
            Clear Chat
          </ClearButton>
        </ActionsContainer>

        <InputArea>
          <ChatInput 
            placeholder="Ask a coding question..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <SendButton onClick={handleSend} disabled={loading || !input.trim()}>
            <IoSend />
          </SendButton>
        </InputArea>
      </ChatContainer>
    </>
  );
};

export default AIChat;
