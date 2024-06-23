import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import 'dayjs/locale/es';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button } from "@/components/ui/button"

import { LuClipboard } from "react-icons/lu";
import { LuClipboardCheck } from "react-icons/lu";
import { useEffect, useState, useCallback, useRef } from "react";

import { CopyToClipboard } from 'react-copy-to-clipboard';

dayjs.extend(relativeTime);
dayjs.locale('es');

const linkify = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a href={part} key={index} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          {part}
        </a>
      );
    }
    
    return part;
  });
};

export const MessageItem = ({ isYou, text, created_at, format_type }) => {

  const [ formattedText, setFormattedText ] = useState(text);
  const [ copied, setCopied ] = useState(false);
  const [ expanded, setExpanded ] = useState(false);
  const [ isOverflowing, setIsOverflowing ] = useState(false);
  const [linkPreview, setLinkPreview] = useState(null);

  const contentRef = useRef(null);
  const maxHeight = 240; // Altura máxima en píxeles
  
  const isValidJson = (text) => {
    try {
      JSON.parse(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  useEffect(() => {
    if (format_type === 'json' && isValidJson(text)) {
      setFormattedText(JSON.stringify(JSON.parse(text), null, 2));
    } else {
      setFormattedText(text);
    }
  }, [ text, format_type ]);

  useEffect(() => {
    if (contentRef.current) {
      setIsOverflowing(contentRef.current.scrollHeight >= maxHeight);
    }
  }, [ formattedText ]);

  const onCopy = useCallback(() => {
    setCopied(true);
    setTimeout(() => {  
      setCopied(false);
    }, 1000);
  }, [])

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`flex ${ isYou ? 'justify-end' : 'justify-start' }`}>
      <div className={`flex flex-col max-w-[80%] p-2 rounded-md shadow-md ${ isYou ? 'bg-slate-800 text-white' : ''}`}>
        <span className="break-all text-left max-w-max">
          {
            format_type === 'json' ? (
              <>
                {/* { text } */}
                otra version del; json
                <span className={`flex flex-col items-start relative m-2 ${expanded ? '' : 'max-h-60 overflow-hidden'}`}
                  ref={ contentRef }>
                  <SyntaxHighlighter language="json" 
                    style={ oneDark } 
                    customStyle={{ 
                      margin: '0', 
                      textOverflow: 'ellipsis', 
                      maxWidth: '520px', 
                      whiteSpace: 'pre', 
                      wordBreak: 'break-all',
                      overflowX: 'hidden',
                      fontSize: '14px',
                      borderRadius: '6px',
                      overflow: 'hidden'
                    }}
                  >
                    { formattedText }
                  </SyntaxHighlighter>

                  <span className="flex justify-center items-center w-[25px] h-[25px] rounded-sm p-0 mr-2 mt-2 absolute top-0 right-0 border opacity-50">
                    <CopyToClipboard onCopy={ onCopy } text={ formattedText }>
                      <Button variant="ghost" className="p-0 h-[100%] w-[100%] rounded-none">
                        {
                          copied ? (
                            <LuClipboardCheck />
                          ) :
                          (
                            <LuClipboard />
                          )
                        }
                      </Button>
                    </CopyToClipboard>
                  </span>
                </span>

                {
                  isOverflowing && (
                    <button 
                      className="text-blue-500 mt-2 ml-2" 
                      onClick={toggleExpand}
                    >
                      {expanded ? 'Ver menos' : 'Ver más'}
                    </button>
                )}
            </>
          ) : (
            // <span className="inner-span inner-content">{formattedText}</span>
            linkify(formattedText)
          )}
        </span>

        {
          linkPreview && (
            <div className="mt-2 p-2 border rounded-md">
              <a href={linkPreview.url} target="_blank" rel="noopener noreferrer">
                <h3 className="font-bold">{linkPreview.title}</h3>
                <p>{linkPreview.description}</p>
                {linkPreview.image && <img src={linkPreview.image} alt="Link preview" className="w-full h-auto" />}
              </a>
            </div>
          )
        }

        <span className="flex justify-end text-[.75rem]">
          { dayjs(created_at).fromNow() }
        </span>
      </div>
    </div>
  )
}
