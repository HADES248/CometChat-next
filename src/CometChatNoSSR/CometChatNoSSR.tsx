import React, { useEffect, useState } from "react";
import {
  CometChatMessageComposer,
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatUIKit,
  UIKitSettingsBuilder
} from "@cometchat/chat-uikit-react";
import { CometChat } from "@cometchat/chat-sdk-javascript";
import { CometChatSelector } from "../CometChatSelector/CometChatSelector";
import "./CometChatNoSSR.css";

// Constants for CometChat configuration
const COMETCHAT_CONSTANTS = {
  APP_ID: "", // Replace with your actual App ID from CometChat
  REGION: "", // Replace with your App's Region
  AUTH_KEY: "", // Replace with your Auth Key (leave blank if using Auth Token)
};

// Functional Component
const CometChatNoSSR: React.FC = () => {
  // State to store the logged-in user
  const [user, setUser] = useState<CometChat.User | undefined>(undefined);
  // State to store selected user or group
  const [selectedUser, setSelectedUser] = useState<CometChat.User | undefined>(undefined);
  const [selectedGroup, setSelectedGroup] = useState<CometChat.Group | undefined>(undefined);

  useEffect(() => {
    // Initialize UIKit settings
    const UIKitSettings = new UIKitSettingsBuilder()
      .setAppId(COMETCHAT_CONSTANTS.APP_ID)
      .setRegion(COMETCHAT_CONSTANTS.REGION)
      .setAuthKey(COMETCHAT_CONSTANTS.AUTH_KEY)
      .subscribePresenceForAllUsers()
      .build();

    // Initialize CometChat UIKit
    CometChatUIKit.init(UIKitSettings)
      ?.then(() => {
        console.log("Initialization completed successfully");
        // Check if user is already logged in
        CometChatUIKit.getLoggedinUser().then((loggedInUser) => {
          if (!loggedInUser) {
            // Perform login if no user is logged in
            CometChatUIKit.login("cometchat-uid-3")
              .then((user) => {
                console.log("Login Successful", { user });
                setUser(user);
              })
              .catch((error) => console.error("Login failed", error));
          } else {
            console.log("Already logged-in", { loggedInUser });
            setUser(loggedInUser);
          }
        });
      })
      .catch((error) => console.error("Initialization failed", error));
  }, []);

  return user ? (
    <div className="conversations-with-messages">
      {/* Sidebar with conversation list */}
      <div className="conversations-wrapper">
        <CometChatSelector
          onSelectorItemClicked={(activeItem) => {
            let item = activeItem;
            // Extract the conversation participant
            if (activeItem instanceof CometChat.Conversation) {
              item = activeItem.getConversationWith();
            }
            // Update states based on the type of selected item
            if (item instanceof CometChat.User) {
              setSelectedUser(item as CometChat.User);
              setSelectedGroup(undefined);
            } else if (item instanceof CometChat.Group) {
              setSelectedUser(undefined);
              setSelectedGroup(item as CometChat.Group);
            } else {
              setSelectedUser(undefined);
              setSelectedGroup(undefined);
            }
          }}
        />
      </div>

      {/* Message view section */}
      {selectedUser || selectedGroup ? (
        <div className="messages-wrapper">
          <CometChatMessageHeader user={selectedUser} group={selectedGroup} />
          <CometChatMessageList user={selectedUser} group={selectedGroup} />
          <CometChatMessageComposer user={selectedUser} group={selectedGroup} />
        </div>
      ) : (
        <div className="empty-conversation">Select Conversation to start</div>
      )}
    </div>
  ) : undefined;
};

export default CometChatNoSSR;