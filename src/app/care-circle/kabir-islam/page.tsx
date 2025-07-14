
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
        d="M20 12.5a8.5 8.5 0 0 0-17 0"
      />
      <path d="M4 12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4" />
      <path d="M12 2v2" />
      <path d="M12 18v2" />
    </svg>
);

export default function KabirPage() {
  return (
    <ChatRoom
      counsellorId="kabir_islam"
      counsellorName="Kabir Islam"
      roomName="SoulCircle"
      tagline="A cozy place to unburden."
      avatarSrc="/images/kabir-islam.png"
      theme={kabirTheme}
      headerIcon={<KabirIcon />}
      placeholderText="You’re chatting with Kabir Islam. This space is private and judgment-free."
      loadingMessage="Kabir is thinking..."
    />
  );
}
