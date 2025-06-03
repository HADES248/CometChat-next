'use client';
import dynamic from "next/dynamic";
import '@cometchat/chat-uikit-react/css-variables.css';


// Dynamically import CometChat component with SSR disabled
const CometChatComponent = dynamic(() => import("../CometChatNoSSR/CometChatNoSSR"), {
  ssr: false,
});

export default function Home() {
  return <CometChatComponent />;
}