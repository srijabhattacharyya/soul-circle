'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const vikramTheme: ChatRoomTheme = {
  backgroundGradient: 'from-slate-50 to-blue-50',
  header: 'bg-blue-800 text-white border-b border-blue-700 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-blue-400',
  userMessage: 'bg-gray-200 text-gray-900',
  counsellorMessage: 'bg-blue-100 text-blue-900',
  sendButton: 'bg-blue-700 hover:bg-blue-800',
  inputRing: 'focus:ring-blue-500 focus:border-blue-500',
};

const VikramIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-blue-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
);

export default function VikramPage() {
  return (
    <ChatRoom
      counsellorId="vikram"
      counsellorName="Vikram"
      roomName="OpenDialogue"
      tagline="Honest & non-judgmental."
      avatarSrc="/images/vikram.png"
      theme={vikramTheme}
      headerIcon={<VikramIcon />}
      placeholderText="You’re chatting with Vikram. This space is private and judgment-free."
      loadingMessage="Vikram is thinking..."
    />
  );
}
