/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  StatusBar,
  // StyleSheet,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {GiftedChat} from 'react-native-gifted-chat';
import Axios from 'axios';

const API_PATH = 'https://620120b1fdf5090017249868.mockapi.io/api/v1/messages';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flexDirection: 'column',
    height: '100%',
  };

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getMessages(1);
  }, []);

  const getMessages = async pageNum => {
    try {
      const response = await Axios.get(API_PATH, {
        params: {
          page: pageNum,
          limit: 10,
        },
      });

      const newMsgs = messages.concat(
        response.data.map(msg => {
          return {
            _id: msg.id,
            text: msg.body,
            createdAt: msg.createdAt,
            user: {
              _id: msg.user,
              name: msg.username,
              avatar: msg.avatar,
            },
          };
        }),
      );
      setMessages(newMsgs);
    } catch (err) {
      console.log(err);
    }
  };

  const onSend = useCallback((msgs = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, msgs));
  }, []);

  const loadMoreMessages = () => {
    getMessages(page + 1);
    setPage(page + 1);
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GiftedChat
        messages={messages}
        onSend={msg => onSend(msg)}
        renderUsernameOnMessage
        listViewProps={{
          onEndReached: loadMoreMessages,
        }}
        user={{
          _id: 1,
          name: 'Zach',
        }}
      />
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({

// });

export default App;
