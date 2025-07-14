
'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from '@/components/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { getCounsellorPersona, saveMessage } from '@/lib/firebase/service';
import { chatWithCounsellor } from '@/ai/flows/chat-flow';
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { doc, onSnapshot, type Timestamp } from 'firebase/firestore';
import { db, isConfigValid } from '@/lib/firebase/config';
import Link from 'next/link';

export type ChatMessage = {
  role: 'user' | 'model';
  content: string;
  timestamp?: Timestamp;
};

export type ChatRoomTheme = {
  backgroundGradient: string;
  header: string;
  counsellorName: string;
  avatarBorder: string;
  userMessage: string;
  counsellorMessage: string;
  sendButton: string;
  inputRing: string;
};

type ChatRoomProps = {
  counsellorId: string;
  counsellorName: string;
  roomName: string;
  tagline: string;
  avatarSrc: string;
  theme: ChatRoomTheme;
  headerIcon: ReactNode;
  placeholderText: string;
  loadingMessage: string;
};

const GENERIC_PERSONA = "You are a friendly and supportive AI assistant. Your goal is to listen, be empathetic, and help the user talk through their feelings. You are not a licensed therapist, but a caring companion.";


export function ChatRoom({
  counsellorId,
  counsellorName,
  roomName,
  tagline,
  avatarSrc,
  theme,
  headerIcon,
  placeholderText,
  loadingMessage,
}: ChatRoomProps) {
  const { user, firebaseReady } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isPersonaLoading, setIsPersonaLoading] = useState(true);
  const [persona, setPersona] = useState<string | null>(null);
  const chatHistoryRef = useRef<HTMLDivElement>(null);

  // Effect to fetch the counsellor's persona
  useEffect(() => {
    let isMounted = true;
    
    const fetchPersona = async () => {
      if (!firebaseReady || !counsellorId || !user) {
        if (!firebaseReady) {
          toast({
            title: 'Offline Mode',
            description: 'Chat features are disabled. Using a generic assistant.',
            variant: 'destructive',
          });
          if (isMounted) {
            setPersona(GENERIC_PERSONA);
            setIsPersonaLoading(false);
          }
        } else {
            setIsPersonaLoading(true);
        }
        return;
      }
      
      setIsPersonaLoading(true);
      try {
        const fetchedPersona = await getCounsellorPersona(counsellorId);
        if (isMounted) {
          if (fetchedPersona) {
            setPersona(fetchedPersona);
          } else {
            console.warn(`Persona for counsellorId "${counsellorId}" not found in Firestore. Falling back to generic persona.`);
            toast({
              title: 'Counsellor Not Found',
              description: 'Using a generic assistant as the persona could not be loaded.',
              variant: 'destructive',
            });
            setPersona(GENERIC_PERSONA);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to fetch counsellor persona:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch counsellor details. Using a generic assistant.',
            variant: 'destructive',
          });
          setPersona(GENERIC_PERSONA);
        }
      } finally {
        if (isMounted) {
            setIsPersonaLoading(false);
        }
      }
    };
        
    fetchPersona();
        
    return () => { isMounted = false; };

  }, [counsellorId, firebaseReady, user, toast]);


  // Effect for real-time chat updates
  useEffect(() => {
    if (!user || !firebaseReady) return;

    const chatId = `${user.uid}_${counsellorId}`;
    const docRef = doc(db, 'chats', chatId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
          setMessages(docSnap.data().messages || []);
      } else {
          setMessages([]);
      }
    }, (error) => {
        toast({
        title: 'Error',
        description: 'Could not load chat history.',
        variant: 'destructive',
        });
    });

    return () => unsubscribe();

  }, [user, counsellorId, firebaseReady, toast]);


  useEffect(() => {
    chatHistoryRef.current?.scrollTo({
      top: chatHistoryRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || !input.trim() || !user || !persona) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    const currentInput = input;
    setInput('');
    setIsSending(true);
    
    try {
      if (firebaseReady) {
        await saveMessage(user.uid, counsellorId, userMessage);
      }
    
      const historyForAI = messages.slice(-10).map(({ role, content }) => ({ role, content }));
      
      const aiResult = await chatWithCounsellor({
        persona,
        history: historyForAI,
        message: currentInput,
      });
      
      const counsellorMessage: ChatMessage = { role: 'model', content: aiResult.response };
      
      if (firebaseReady) {
        await saveMessage(user.uid, counsellorId, counsellorMessage);
      } else {
        // Handle offline mode: just update local state
        setMessages(prev => [...prev, userMessage, counsellorMessage]);
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: 'The AI could not respond. Please try again.',
        variant: 'destructive',
      });
       const errorMessage: ChatMessage = { role: 'model', content: "I'm having trouble connecting right now. Please try again in a moment." };
       if(firebaseReady) {
         await saveMessage(user.uid, counsellorId, errorMessage);
       } else {
         setMessages(prev => [...prev, userMessage, errorMessage]);
       }
    } finally {
      setIsSending(false);
    }
  };

  const isButtonDisabled = isSending || !input.trim() || isPersonaLoading;

  return (
    <div className={cn('min-h-screen w-full p-4 sm:p-6 flex items-center justify-center bg-gradient-to-br', theme.backgroundGradient)}>
      <div className="bg-white rounded-xl shadow-2xl p-0 max-w-4xl w-full h-[90vh] flex flex-col border border-gray-200">
        <header className={cn('p-4 rounded-t-xl flex items-center justify-between', theme.header)}>
          <div className="flex items-center">
            <Image
              src={avatarSrc}
              alt={`Avatar for ${counsellorName}`}
              width={60}
              height={60}
              className={cn('rounded-full border-2', theme.avatarBorder)}
            />
            <div className="ml-4">
              <h1 className={cn('text-xl font-semibold', theme.counsellorName)}>{counsellorName}</h1>
              <p className="text-sm opacity-90">{tagline}</p>
            </div>
          </div>
          {headerIcon}
        </header>
        
        <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
          {isPersonaLoading && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500 italic py-8 flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Connecting to {counsellorName}...
                </div>
              </div>
          )}
          {!isPersonaLoading && messages.length === 0 && (
            <div className="text-center text-gray-500 italic py-8">{placeholderText}</div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'p-3 rounded-lg max-w-[75%] shadow-sm',
                  msg.role === 'user' ? theme.userMessage : theme.counsellorMessage
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}
           {isSending && (
             <div className="flex justify-start">
                <div className={cn('p-3 rounded-lg max-w-[75%] shadow-sm flex items-center space-x-2', theme.counsellorMessage)}>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>{loadingMessage}</span>
                </div>
            </div>
           )}
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center p-4 bg-white border-t border-gray-200 rounded-b-xl">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    if (!isButtonDisabled) handleSendMessage(e);
                }
            }}
            placeholder="Type your message here..."
            className={cn('flex-1 border-gray-300 p-2 resize-none bg-white text-black', theme.inputRing)}
            rows={1}
            disabled={isPersonaLoading || isSending}
          />
          <Button type="submit" className={cn('ml-4 p-3 rounded-lg shadow-md transition', theme.sendButton)} disabled={isButtonDisabled}>
            {isSending ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
          </Button>
        </form>
         <div className="text-center py-2 bg-white rounded-b-xl">
             <Button asChild variant="link" size="sm">
                <Link href="/care-circle">Back to Care Circle</Link>
             </Button>
         </div>
      </div>
    </div>
  );
}
