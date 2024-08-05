import './Chatbox.css';
import { initializeApp } from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  setDoc,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
import { Button, Input, Layout, Dropdown } from 'antd';
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import {
  angryIcon,
  careIcon,
  hahaIcon,
  likeIcon,
  loveIcon,
  sadIcon,
  wowIcon
} from '../../assets/reactions/reactions';
import firebaseConfig from './firebaseConfig';

const { Header, Content, Footer } = Layout;

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

function ChatBox() {
  const [visible, setVisible] = useState(false);
  const messagesRef = collection(firestore, 'messages');
  const messagesQuery = query(
    messagesRef,
    orderBy('createdAt', 'desc'),
    limit(25)
  );
  const [messages] = useCollectionData(messagesQuery, { idField: 'id' });
  const [formValue, setFormValue] = useState('');
  const messagesEndRef = useRef(null);
  const [sending, setSending] = useState('');

  const toggleChatbox = () => {
    setVisible(!visible);
  };

  const closeChatbox = () => {
    setVisible(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (visible) {
      scrollToBottom();
    }
  }, [visible]);
  useEffect(() => {
    const sendMessageAsync = async () => {
      if (sending) {
        try {
          setFormValue('');
          const userJson = sessionStorage.getItem('user');
          const user = JSON.parse(userJson);
          const username = user.username;
          const reaction = {};
          const messageId = Date.now().toString();
          const messageRef = doc(messagesRef, messageId);

          await setDoc(messageRef, {
            id: messageId,
            text: sending,
            createdAt: serverTimestamp(),
            username,
            reaction
          });

          setSending('');
          scrollToBottom();
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    };

    sendMessageAsync();
  }, [sending]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (formValue.trim() === '') {
      return;
    }
    setSending(formValue);
  };

  const reversedMessages = messages?.slice().reverse();
  useEffect(() => {
    scrollToBottom();
    const handleStorageChange = (event) => {
      if (event.storageArea === sessionStorage) {
        // Handle changes in sessionStorage if needed
        console.log('SessionStorage changed:', event);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  return (
    <div className="chatbox-container">
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        size="large"
        onClick={toggleChatbox}
        className="fixed bottom-7 right-7 z-50 shadow-lg hover:shadow-2xl !bg-primary-dominant hover:!bg-primary-dominant-dark focus:!bg-primary-dominant-light"
      />
      {visible && (
        <Layout className={`chatbox ${visible ? 'chatbox-visible' : ''}`}>
          <Header className="chatbox-header">
            <div className="chatbox-title">Chat</div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              onClick={closeChatbox}
            />
          </Header>
          <Content className="chatbox-messages">
            {reversedMessages &&
              reversedMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  text={msg.text}
                  username={msg.username}
                  createdAt={msg.createdAt}
                  id={msg.id}
                  reaction={msg.reaction}
                />
              ))}
            <div ref={messagesEndRef} />
          </Content>
          <Footer className="chatbox-input-container">
            <div className="chat-form">
              <form onSubmit={sendMessage}>
                <Input
                  className="chatbox-input"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="Type a message"
                  suffix={
                    <SendOutlined
                      onClick={sendMessage}
                      style={{ cursor: 'pointer' }}
                    />
                  }
                />
              </form>
            </div>
          </Footer>
        </Layout>
      )}
    </div>
  );
}

function ChatMessage({ text, username, createdAt, id, reaction }) {
  const deleteMessage = async (id) => {
    const messageDoc = doc(firestore, 'messages', id.toString());
    try {
      await deleteDoc(messageDoc);
      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message: ', error);
    }
  };

  const userJson = sessionStorage.getItem('user');
  const user = JSON.parse(userJson);
  const messageClass = username === user?.username ? 'sent' : 'received';

  const formattedTime = createdAt
    ? createdAt.toDate().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    : '';
  const [reactions, setReactions] = useState({
    like: 0,
    love: 0,
    haha: 0,
    angry: 0,
    care: 0,
    sad: 0,
    wow: 0
  });
  const [totalReaction, setTotalReaction] = useState(0);
  useEffect(() => {
    const countReactions = () => {
      const counts = {
        like: 0,
        love: 0,
        haha: 0,
        angry: 0,
        care: 0,
        sad: 0,
        wow: 0
      };
      let total = 0;
      if (reaction) {
        Object.values(reaction).forEach((reactionType) => {
          if (reactionType in counts) {
            counts[reactionType] += 1;
            total += 1;
          }
        });
      }
      setReactions(counts);
      setTotalReaction(total);
    };
    countReactions();
  }, [reaction]);

  const handleReaction = async (value) => {
    const messageDoc = doc(firestore, 'messages', id.toString());
    const userJson = sessionStorage.getItem('user');
    const user = JSON.parse(userJson);
    const key = user.username;
    try {
      await updateDoc(messageDoc, {
        [`reaction.${key}`]: value
      });
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const items = [
    {
      key: 'like',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('like')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('like')}
          aria-label="Like"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={likeIcon} alt="Like" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'love',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('love')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('love')}
          aria-label="Love"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={loveIcon} alt="Love" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'haha',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('haha')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('haha')}
          aria-label="Haha"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={hahaIcon} alt="Haha" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'wow',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('wow')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('wow')}
          aria-label="Wow"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={wowIcon} alt="Wow" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'sad',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('sad')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('sad')}
          aria-label="Sad"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={sadIcon} alt="Sad" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'angry',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('angry')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('angry')}
          aria-label="Angry"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={angryIcon} alt="Angry" className="w-6 h-6" />
        </button>
      )
    },
    {
      key: 'care',
      label: (
        <button
          type="button"
          onClick={() => handleReaction('care')}
          onKeyDown={(e) => e.key === 'Enter' && handleReaction('care')}
          aria-label="Care"
          style={{ background: 'none', border: 'none', padding: 0 }}
        >
          <img src={careIcon} alt="Care" className="w-6 h-6" />
        </button>
      )
    },
    {
      type: 'divider'
    },
    {
      key: 'more',
      label: (
        <>
          {user?.role === 'super-admin' && (
            <DeleteOutlined
              className="text-red-500 hover:text-red-700 m-2"
              onClick={() => deleteMessage(id)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </>
      )
    }
  ].filter(Boolean);

  return (
    <div className={`message ${messageClass}`}>
      <div
        className={`text-xs font-medium ${messageClass === 'sent' ? 'text-right' : 'text-left'}`}
      >
          {messageClass === 'received' ? (
          <>
            {username}{' '}
            <span className="text-xs italic font-normal 	 ">
              {formattedTime}
            </span>
          </>
        ) : (
          <>
            <span className="text-xs font-thin">{formattedTime}</span>
          </>
        )}
      </div>

      <div
        className={`flex ${messageClass === 'sent' ? 'flex-row-reverse' : 'flex-row'} items-center mt-1`}
      >
        <div
          className={`group relative max-w-[70%] rounded-lg break-words ${messageClass === 'sent' ? 'bg-[#D84152] text-white' : 'bg-[#EEEDEB] text-black'}`}
        >
          <Dropdown
            menu={{ items }}
            trigger={['hover']}
            className="relative group"
            placement="topRight"
            overlayClassName="horizontal-dropdown"
            arrow={false}
          >
            <div className=" p-2 rounded-lg">
              <span>{text}</span>
            </div>
          </Dropdown>
        </div>
        {Object.entries(reactions).map(
          ([key, value]) =>
            value > 0 && (
              <img
                key={key}
                src={`http://127.0.0.1:8000/images/${key}.png`}
                alt={key}
                style={{ margin: '5px', width: '20px', height: '20px' }}
              />
            )
        )}
        {totalReaction > 0 && <p className="ml-2">{totalReaction}</p>}
      </div>
    </div>
  );
}

export default ChatBox;
