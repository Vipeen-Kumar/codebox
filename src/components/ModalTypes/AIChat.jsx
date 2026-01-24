import React, { useState, useContext, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Header, CloseButton } from '../Modal';
import { IoCloseSharp, IoSend, IoCodeSlashOutline, IoTrashOutline, IoCheckmarkCircleOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { ModalContext } from '../../context/ModalContext';
import { PlaygroundContext } from '../../context/PlaygroundContext';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';
import aiIcon from '../../assets/aiicon.png';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.isSidePanel ? '1' : 'none'};
  height: ${props => props.isSidePanel ? 'auto' : '500px'};
  color: #eaeaea;
  padding: 0;
  overflow: hidden;
`;

const MessagesArea = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #252526;
  margin: ${props => props.isSidePanel ? '0' : '0 1rem 1rem 1rem'};
  border-radius: ${props => props.isSidePanel ? '0' : '8px'};
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #3a3a3a;
    border-radius: 3px;
  }
`;

const MessageBubble = styled.div`
  max-width: ${props => props.isSidePanel ? '90%' : '85%'};
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: ${props => props.isUser ? '#007acc' : '#3e3e42'};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  font-size: 0.9rem;
  line-height: 1.5;
  
  pre {
    background: #1e1e1e !important;
    padding: 0.8rem !important;
    border-radius: 6px !important;
    overflow-x: auto;
    font-size: 0.8rem;
  }

  code {
    background: rgba(0,0,0,0.2);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
  }
`;

const SidePanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #333;
  background: #252526;

  h2 {
    font-size: 1.1rem;
    color: #f59e0b;
    margin: 0;
  }
`;

const CloseIconButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  
  &:hover {
    color: #fff;
  }
`;

const InputArea = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
  padding: 1rem;
  background: #1e1e1e;
  border-top: 1px solid #333;
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
  padding: 0.5rem 1rem;
  background: #1e1e1e;
`;

const ActionBlock = styled.div`
  background: #2d2d2d;
  border: 1px solid #444;
  border-left: 4px solid #f59e0b;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
`;

const ActionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #f59e0b;
`;

const ApplyButton = styled.button`
  background: #f59e0b;
  color: #1e1e1e;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const ValidationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  color: ${props => props.type === 'error' ? '#ff4d4d' : props.type === 'success' ? '#4caf50' : '#aaa'};
`;

const languageMap = {
  javascript: { language: 'javascript', version: '18.15.0' },
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'cpp', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' }
};

const AIChat = ({ isSidePanel }) => {
  const { isOpenModal, closeModal } = useContext(ModalContext);
  const { chatHistories, updateChatHistory, folders, addCommit, addPlayground, setIsAIChatOpen } = useContext(PlaygroundContext);
  
  // Get identifiers from modal or from route params if in side panel
  const { folderId: paramFolderId, playgroundId: paramPlaygroundId } = useParams();
  
  const folderId = isSidePanel ? paramFolderId : isOpenModal.identifiers.folderId;
  const playgroundId = isSidePanel ? paramPlaygroundId : isOpenModal.identifiers.playgroundId;
  
  const playground = folders[folderId]?.playgrounds[playgroundId];
  const codeContext = playground?.code;
  const languageContext = playground?.language;

  const [validating, setValidating] = useState({});

  const validateAndApply = async (msgIndex, commitMessage, newCode) => {
    setValidating(prev => ({ ...prev, [msgIndex]: 'validating' }));
    
    try {
      const res = await axios.post('http://localhost:5000/api/piston/execute', {
        language: languageMap[languageContext]?.language || languageContext,
        version: languageMap[languageContext]?.version || "*",
        source_code: newCode,
        stdin: ""
      });

      const { run, compile } = res.data;
      const error = (compile && compile.code !== 0) || (run && run.code !== 0);
      
      if (error) {
        const output = (compile?.stderr || compile?.output) || (run?.stderr || run?.output);
        setValidating(prev => ({ ...prev, [msgIndex]: { status: 'error', message: output } }));
        return;
      }

      addCommit(folderId, playgroundId, commitMessage, newCode);
      setValidating(prev => ({ ...prev, [msgIndex]: { status: 'success', message: 'Applied successfully!' } }));
      
    } catch (err) {
      setValidating(prev => ({ ...prev, [msgIndex]: { status: 'error', message: 'Validation failed: ' + err.message } }));
    }
  };

  const renderMessageContent = (msg, msgIndex) => {
    if (!msg.text) return "No response text received.";
    if (msg.role === 'user') return msg.text;

    const actionRegex = /\[(?:FILE_UPDATE|CREATE_PLAYGROUND)\]([\s\S]*?)\[\/(?:FILE_UPDATE|CREATE_PLAYGROUND)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = actionRegex.exec(msg.text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: msg.text.slice(lastIndex, match.index) });
      }

      const isCreate = match[0].startsWith('[CREATE_PLAYGROUND]');
      const blockContent = match[1];
      const commitMatch = /Commit Message: (.*)/.exec(blockContent);
      const titleMatch = /Title: (.*)/.exec(blockContent);
      const langMatch = /Language: (.*)/.exec(blockContent);
      const codeMatch = /```(?:\w+)?\n([\s\S]*?)```/.exec(blockContent);

      if (isCreate) {
        if (titleMatch && langMatch && codeMatch) {
          parts.push({
            type: 'create',
            title: titleMatch[1],
            language: langMatch[1],
            code: codeMatch[1]
          });
        }
      } else if (commitMatch && codeMatch) {
        parts.push({
          type: 'action',
          commitMessage: commitMatch[1],
          code: codeMatch[1]
        });
      }

      lastIndex = actionRegex.lastIndex;
    }

    if (lastIndex < msg.text.length) {
      parts.push({ type: 'text', content: msg.text.slice(lastIndex) });
    }

    if (parts.length === 0) {
      return (
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
      );
    }

    return parts.map((part, i) => {
      if (part.type === 'text') {
        return (
          <ReactMarkdown
            key={i}
            children={part.content}
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
      );
    } else if (part.type === 'create') {
      const status = validating[msgIndex + '_create_' + i];
      return (
        <ActionBlock key={i} style={{ borderLeftColor: '#4caf50' }}>
          <ActionHeader style={{ color: '#4caf50' }}>
            <span>New Playground Proposal</span>
            <ApplyButton 
              style={{ background: '#4caf50' }}
              onClick={async () => {
                setValidating(prev => ({ ...prev, [msgIndex + '_create_' + i]: 'validating' }));
                try {
                  // Simple validation: check if language is supported
                  if (!languageMap[part.language.toLowerCase()]) {
                    throw new Error('Unsupported language: ' + part.language);
                  }
                  addPlayground(folderId, part.title, part.language.toLowerCase());
                  setValidating(prev => ({ ...prev, [msgIndex + '_create_' + i]: { status: 'success', message: 'Created successfully!' } }));
                } catch (err) {
                  setValidating(prev => ({ ...prev, [msgIndex + '_create_' + i]: { status: 'error', message: err.message } }));
                }
              }}
              disabled={status === 'validating' || status?.status === 'success'}
            >
              {status === 'validating' ? 'Creating...' : status?.status === 'success' ? 'Created' : 'Create Playground'}
            </ApplyButton>
          </ActionHeader>
          <div style={{ fontSize: '0.85rem', color: '#aaa' }}>
            <strong>Title:</strong> {part.title} | <strong>Language:</strong> {part.language}
          </div>
          {status && (
            <ValidationStatus type={status.status}>
              {status.status === 'validating' ? null : status.status === 'success' ? <IoCheckmarkCircleOutline /> : <IoAlertCircleOutline />}
              {status.message}
            </ValidationStatus>
          )}
        </ActionBlock>
      );
    } else {
      const status = validating[msgIndex];
        return (
          <ActionBlock key={i}>
            <ActionHeader>
              <span>Proposed Change</span>
              <ApplyButton 
                onClick={() => validateAndApply(msgIndex, part.commitMessage, part.code)}
                disabled={status === 'validating' || status?.status === 'success'}
              >
                {status === 'validating' ? 'Validating...' : status?.status === 'success' ? 'Applied' : 'Apply Changes'}
              </ApplyButton>
            </ActionHeader>
            <div style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>
              <strong>Commit:</strong> {part.commitMessage}
            </div>
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={languageContext}
              children={part.code}
              customStyle={{ fontSize: '0.85rem' }}
            />
            {status && (
              <ValidationStatus type={status.status}>
                {status.status === 'validating' ? null : status.status === 'success' ? <IoCheckmarkCircleOutline /> : <IoAlertCircleOutline />}
                {status === 'validating' ? 'Testing code execution...' : status.message}
              </ValidationStatus>
            )}
          </ActionBlock>
        );
      }
    });
  };

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

You have permission to DIRECTLY MODIFY code or CREATE NEW playgrounds. 

To propose a change to the current file:
[FILE_UPDATE]
Commit Message: <brief description>
Code:
\`\`\`${languageContext}
<full updated code>
\`\`\`
[/FILE_UPDATE]

To propose creating a NEW playground in the current folder:
[CREATE_PLAYGROUND]
Title: <playground name>
Language: <cpp|java|python|javascript>
Code:
\`\`\`<language>
<initial code>
\`\`\`
[/CREATE_PLAYGROUND]

All changes are validated before implementation.`;

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

      const aiText = response.data.text || "I received an empty response from the AI. Please try rephrasing your question.";
      const aiMessage = { role: 'model', text: aiText };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      const errorMessage = error.response?.data?.details || error.message || 'Sorry, I encountered an error. Please try again.';
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMessage}` }]);
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
      {isSidePanel ? (
        <SidePanelHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <img src={aiIcon} alt="AI" style={{ width: '20px', height: '20px' }} onError={(e) => {e.target.style.display='none'}} />
            <h2>AI Assistant</h2>
          </div>
          <CloseIconButton onClick={() => setIsAIChatOpen(false)}>
            <IoCloseSharp />
          </CloseIconButton>
        </SidePanelHeader>
      ) : (
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <img src={aiIcon} alt="AI" style={{ width: '24px', height: '24px' }} />
              <h2 style={{ color: '#f59e0b', margin: 0 }}>AI Assistant</h2>
          </div>
          <CloseButton onClick={closeModal}>
            <IoCloseSharp />
          </CloseButton>
        </Header>
      )}

      <ChatContainer isSidePanel={isSidePanel}>
        <MessagesArea isSidePanel={isSidePanel}>
          {messages.map((msg, index) => (
            <MessageBubble key={index} isUser={msg.role === 'user'} isSidePanel={isSidePanel}>
              {renderMessageContent(msg, index)}
            </MessageBubble>
          ))}
          {loading && (
            <MessageBubble isUser={false} isSidePanel={isSidePanel}>
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
            {isSidePanel ? 'Clear' : 'Clear Chat'}
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
