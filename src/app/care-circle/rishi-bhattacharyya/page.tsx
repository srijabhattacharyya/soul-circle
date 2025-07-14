
'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const rishiTheme: ChatRoomTheme = {
  backgroundGradient: 'from-blue-50 to-indigo-50',
  header: 'bg-indigo-900 text-white border-b border-indigo-800 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-indigo-400',
  userMessage: 'bg-purple-100 text-purple-900',
  counsellorMessage: 'bg-indigo-200 text-indigo-900',
  sendButton: 'bg-indigo-700 hover:bg-indigo-800',
  inputRing: 'focus:ring-indigo-500 focus:border-indigo-500',
};

const RishiIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-indigo-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        />
    </svg>
);


export default function RishiPage() {
  return (
    <ChatRoom
      counsellorId="rishi_bhattacharyya"
      counsellorName="Rishi Bhattacharyya"
      roomName="InnerVoice Chat"
      tagline="Where quiet reflections lead to clarity."
      avatarSrc="https://placehold.co/60x60/E0E7FF/3730A3.png?text=RB"
      theme={rishiTheme}
      headerIcon={<RishiIcon />}
      placeholderText="You’re chatting with Rishi Bhattacharyya. This space is private and judgment-free."
      loadingMessage="Rishi is reflecting..."
    />
  );
}
