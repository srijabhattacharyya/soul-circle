'use client';
import { ChatRoom, type ChatRoomTheme } from '@/components/chat-room';

const ananyaTheme: ChatRoomTheme = {
  backgroundGradient: 'from-amber-50 to-rose-50',
  header: 'bg-amber-50 text-gray-800 border-b border-gray-200 shadow-md',
  counsellorName: 'text-rose-800',
  avatarBorder: 'border-rose-400',
  userMessage: 'bg-amber-100 text-amber-900',
  counsellorMessage: 'bg-rose-200 text-rose-900',
  sendButton: 'bg-rose-600 hover:bg-rose-700',
  inputRing: 'focus:ring-rose-500 focus:border-rose-500',
};

const AnanyaIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 text-rose-700"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.62a8.983 8.983 0 013.362-3.797z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.362 5.214C14.156 5.666 13.11 6.428 12.242 7.394m3.12-2.18a8.255 8.255 0 00-3.12-2.18m0 0A8.25 8.25 0 005.962 5.962a8.255 8.255 0 003.12 2.18m0 0a8.25 8.25 0 013.362 3.797M9.082 8.148a8.983 8.983 0 013.362-3.797L12.242 7.394"
    />
  </svg>
);

export default function DrAnanyaPage() {
  return (
    <ChatRoom
      counsellorId="dr_ananya_banerjee"
      counsellorName="Dr. Ananya Banerjee"
      roomName="The Listening Room"
      tagline="Because being heard is the first step to healing."
      avatarSrc="https://placehold.co/60x60/FEE2E2/991B1B?text=AB"
      theme={ananyaTheme}
      headerIcon={<AnanyaIcon />}
      placeholderText="You’re chatting with Dr. Ananya Banerjee. This space is private and judgment-free."
      loadingMessage="Dr. Ananya is listening..."
    />
  );
}
