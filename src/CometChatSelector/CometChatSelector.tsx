import { useEffect, useState } from "react";
import { Conversation, Group, User } from "@cometchat/chat-sdk-javascript";
import { CometChatConversations, CometChatUIKitLoginListener } from "@cometchat/chat-uikit-react";
import { CometChat } from '@cometchat/chat-sdk-javascript';
import "./CometChatSelector.css";

// Define props interface for component
interface SelectorProps {
    onSelectorItemClicked?: (input: User | Group | Conversation, type: string) => void;
}

// CometChatSelector component definition
export const CometChatSelector = (props: SelectorProps) => {
    const {
        onSelectorItemClicked = () => { }, // Default function if no prop is provided
    } = props;

    // State to store the currently logged-in user
    const [loggedInUser, setLoggedInUser] = useState<CometChat.User | null>();
    
    // State to track the currently selected item (conversation, user, group, or call)
    const [activeItem, setActiveItem] = useState<
        CometChat.Conversation | CometChat.User | CometChat.Group | CometChat.Call | undefined
    >();

    useEffect(() => {
        // Retrieve the logged-in user from CometChat's login listener
        let loggedInUser = CometChatUIKitLoginListener.getLoggedInUser();
        setLoggedInUser(loggedInUser);
    }, [CometChatUIKitLoginListener?.getLoggedInUser()]); // Dependency array to trigger effect when user changes

    return (
        <>
            {/* Render CometChatConversations only if a user is logged in */}
            {loggedInUser && (
                <>
                    <CometChatConversations
                        activeConversation={activeItem instanceof CometChat.Conversation ? activeItem : undefined}
                        onItemClick={(e) => {
                            setActiveItem(e); // Update the selected item state
                            onSelectorItemClicked(e, "updateSelectedItem"); // Trigger callback with selected item
                        }}
                    />
                </>
            )}
        </>
    );
}; 