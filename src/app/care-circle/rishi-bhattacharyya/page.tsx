
'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const rishiTheme: ChatRoomTheme = {
  backgroundGradient: 'from-indigo-50 to-purple-50',
  header: 'bg-indigo-700 text-white border-b border-indigo-600 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-indigo-400',
  userMessage: 'bg-gray-200 text-gray-900',
  counsellorMessage: 'bg-indigo-100 text-indigo-900',
  sendButton: 'bg-indigo-600 hover:bg-indigo-700',
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
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export default function RishiPage() {
  return (
    <ChatRoom
      counsellorId="rishi_bhattacharyya"
      counsellorName="Rishi Bhattacharyya"
      roomName="InnerVoice Chat"
      tagline="A space for quiet contemplation."
      avatarSrc="https://placehold.co/120x120.png"
      theme={rishiTheme}
      headerIcon={<RishiIcon />}
      placeholderText="You’re chatting with Rishi Bhattacharyya. This space is private and judgment-free."
      loadingMessage="Rishi is reflecting..."
    />
  );
}
