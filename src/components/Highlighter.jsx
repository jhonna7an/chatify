import React, { useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

SyntaxHighlighter.registerLanguage('json', json);

const CodeBlock = ({ language, value }) => (
    <SyntaxHighlighter language={language} style={docco}>
        {value}
    </SyntaxHighlighter>
);

const MessageContainer = styled.div`
    background-color: #f4f4f8;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
    width: fit-content;
    max-width: 80%;
`;

const ChatContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 80vh;
    width: 80vw;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px;
`;

const MessagesList = styled.div`
    flex: 1;
    overflow-y: auto;
    padding: 10px;
`;

const InputContainer = styled.div`
    display: flex;
    padding: 10px;
    border-top: 1px solid #ccc;
`;

const Textarea = styled.textarea`
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
`;

const SendButton = styled.button`
    padding: 10px 20px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

const Message = ({ content }) => {
    // const codeString = `import SyntaxHighlighter from 'react-syntax-highlighter';
    // import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
    
    // export const Highlighter = () => {
    //     const codeString = '(num) => num + 1';
    //     return (
    //       <SyntaxHighlighter language="jsx" style={docco}>
    //         {codeString}
    //       </SyntaxHighlighter>
    //     );
    // }
    // `;
    // return (
    //   <SyntaxHighlighter language="jsx" style={ atomOneDark }>
    //     {codeString}
    //   </SyntaxHighlighter>
    // );

    return (
        <MessageContainer>
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </MessageContainer>
    );
}

export const Highlighter = () => {
    const [messages, setMessages] = useState([
        { type: 'text', content: 'Hello!' },
        { type: 'code', content: '```json\n{"name": "John", "age": 30, "city": "New York"}\n```' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        const newMessage = { type: 'code', content: `\`\`\`json\n${input}\n\`\`\`` };
        setMessages([...messages, newMessage]);
        setInput('');
    };

    return (
        <ChatContainer>
            <MessagesList>
                {messages.map((message, index) => (
                    <div key={index}>
                        <Message content={message.content} />
                    </div>
                ))}
            </MessagesList>
            <InputContainer>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your message or JSON code"
                />
                <SendButton onClick={handleSend}>Send</SendButton>
            </InputContainer>
        </ChatContainer>
    );
};
