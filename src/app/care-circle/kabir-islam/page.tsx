'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const kabirTheme: ChatRoomTheme = {
  backgroundGradient: 'from-emerald-50 to-lime-50',
  header: 'bg-emerald-700 text-white border-b border-emerald-600 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-emerald-400',
  userMessage: 'bg-lime-100 text-lime-900',
  counsellorMessage: 'bg-emerald-100 text-emerald-900',
  sendButton: 'bg-emerald-600 hover:bg-emerald-700',
  inputRing: 'focus:ring-emerald-500 focus:border-emerald-500',
};

const KabirIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-lime-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

export default function KabirPage() {
  return (
    <ChatRoom
      counsellorId="kabir_islam"
      counsellorName="Kabir Islam"
      roomName="TalkNest"
      tagline="A cozy place to unburden."
      avatarSrc="https://placehold.co/60x60/D1FAE5/065F46.png?text=KI"
      theme={kabirTheme}
      headerIcon={<KabirIcon />}
      placeholderText="You’re chatting with Kabir Islam. This space is private and judgment-free."
      loadingMessage="Kabir is thinking..."
    />
  );
}
