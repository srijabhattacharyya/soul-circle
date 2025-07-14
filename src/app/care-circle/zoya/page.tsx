'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const zoyaTheme: ChatRoomTheme = {
  backgroundGradient: 'from-pink-50 to-rose-50',
  header: 'bg-rose-500 text-white border-b border-rose-400 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-rose-300',
  userMessage: 'bg-pink-100 text-pink-900',
  counsellorMessage: 'bg-rose-100 text-rose-900',
  sendButton: 'bg-rose-600 hover:bg-rose-700',
  inputRing: 'focus:ring-rose-500 focus:border-rose-500',
};

const ZoyaIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
);


export default function ZoyaPage() {
  return (
    <ChatRoom
      counsellorId="zoya"
      counsellorName="Zoya"
      roomName="SafeSpace"
      tagline="A gentle, trusted place to open up."
      avatarSrc="/images/zoya.png"
      theme={zoyaTheme}
      headerIcon={<ZoyaIcon />}
      placeholderText="You’re chatting with Zoya. This space is private and judgment-free."
      loadingMessage="Zoya is listening..."
    />
  );
}
