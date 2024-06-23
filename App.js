import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Chat,
  ChannelList,
  Channel,
  OverlayProvider,
  MessageList,
  MessageInput,
  Thread
} from 'stream-chat-expo';

import { StreamChat } from 'stream-chat';
import { chatApiKey, chatUserId } from './config/chatConfig';
import { useChatClient } from './hooks/useChatClient';
import { AppProvider, useAppContext } from "./hooks/AppContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

const ChannelScreen = props => {
  const { navigation } = props;
  const { channel, setThread } = useAppContext();
  return (
    <Channel channel={channel}>
      <MessageList
        onThreadSelect={(message) => {
          if (channel?.id) {
            setThread(message);
            navigation.navigate('ThreadScreen');
          }
        }}
      />
      <MessageInput />
    </Channel>
  );
}

const ChannelListScreen = props => {
  const { setChannel } = useAppContext();
  return (
    <ChannelList
      onSelect={(channel) => {
        const { navigation } = props;
        setChannel(channel);
        navigation.navigate('ChannelScreen');
      }}
      filters={filters}
      sort={sort}
    />
  );
};

const ThreadScreen = props => {
  const { channel, thread } = useAppContext();
  return (
    <Channel channel={channel} thread={thread} threadList>
      <Thread />
    </Channel>
  );
}

const chatClient = StreamChat.getInstance(chatApiKey);

const filters = {
  members: {
    '$in': [chatUserId]
  },
};

const sort = {
  last_message_at: -1,
};


const NavigationStack = () => {
  const { clientIsReady } = useChatClient();

  return !clientIsReady ?
    (
      <View className="flex-1 bg-red-500">
        <Text>
          Loading chat ...
        </Text>
      </View>
    )
    : (
      <OverlayProvider>
        <Chat client={chatClient}>
          <Stack.Navigator>
            <Stack.Screen name="Channel List" component={ChannelListScreen} />
            <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
            <Stack.Screen name="ThreadScreen" component={ThreadScreen} />
          </Stack.Navigator>
        </Chat>
      </OverlayProvider>
    )

};

export default () => {
  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationContainer>
            <NavigationStack />
          </NavigationContainer>
        </SafeAreaView>
      </GestureHandlerRootView>
    </AppProvider>
  );
};