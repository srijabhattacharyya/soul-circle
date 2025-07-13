'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const taraTheme: ChatRoomTheme = {
  backgroundGradient: 'from-teal-50 to-emerald-50',
  header: 'bg-teal-800 text-white border-b border-teal-700 shadow-md',
  counsellorName: 'text-white',
  avatarBorder: 'border-teal-400',
  userMessage: 'bg-teal-100 text-teal-900',
  counsellorMessage: 'bg-amber-50 text-amber-900',
  sendButton: 'bg-teal-700 hover:bg-teal-800',
  inputRing: 'focus:ring-teal-500 focus:border-teal-500',
};

const TaraIcon = () => (
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
      d="M12 21a9 9 0 01-9-9 4.5 4.5 0 014.5-4.5c1.474 0 2.809.682 3.654 1.846A4.5 4.5 0 0116.5 7.5a9 9 0 01-9 9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 7.5c-1.474 0-2.809-.682-3.654-1.846A4.5 4.5 0 017.5 3a9 9 0 019 9 4.5 4.5 0 01-4.5 4.5c-1.474 0-2.809-.682-3.654-1.846A4.5 4.5 0 017.5 12z"
    />
  </svg>
);

export default function DrTaraPage() {
  return (
    <ChatRoom
      counsellorId="dr_tara_mehta"
      counsellorName="Dr. Tara Mehta"
      roomName="CareConnect"
      tagline="Where support and connection meet."
      avatarSrc="https://placehold.co/60x60/CCFBF1/0F766E.png?text=TM"
      theme={taraTheme}
      headerIcon={<TaraIcon />}
      placeholderText="You’re chatting with Dr. Tara Mehta. This space is private and judgment-free."
      loadingMessage="Dr. Tara is responding..."
    />
  );
}
