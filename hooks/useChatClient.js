import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId, chatUserName, chatUserToken } from '../config/chatConfig';

const chatClient = StreamChat.getInstance(chatApiKey);

export const useChatClient = (props) => {
  const [clientIsReady, setClientIsReady] = useState(false);

  const user = {
    id: chatUserId,
    name: chatUserName,
  };

  useEffect(() => {
    const setupClient = async () => {
      try {
        chatClient.connectUser(user, chatUserToken);
        setClientIsReady(true);

      } catch (error) {
        if (error instanceof Error) {
          console.error(`An error occurred while connecting the user: ${error.message}`);
        }
      }
    };

    // If the chat client has a value in the field `userID`, a user is already connected
    // and we can skip trying to connect the user again.
    if (!chatClient.userID) {
      setupClient();
    }
  }, []);

  return {
    clientIsReady,
  };
};