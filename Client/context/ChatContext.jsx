import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-hot-toast";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setunseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext); // ✅ FIXED: spelling

  // Defensive check
  if (!axios) {
    console.error("Axios is undefined from AuthContext");
  }

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      setUsers(data.users);
      setunseenMessages(data.unseenMsg);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
// subscribe to messages for selected user
 const subscribeToMessages=async()=>
 {
  if(!socket)return ;
  socket.on("newMessage",(newMessage)=>
  
  {
    if(selectedUser&&newMessage.senderId===selectedUser._id)
    {
      newMessage.seen=true;
     setMessages((prev) => [...prev, newMessage]); 

      axios.put(`/api/messages/mark/${newMessage._id}`);

    }
    else{
      setunseenMessages((prev)=>({...prev,[newMessage.senderId]:
        prev[newMessage.senderId]?prev[newMessage.senderId]+1:1
    }))
    }

  })
 }

//  unsubscribe messages
const unsubscribeFromMessages=async()=>
{
  if(socket)socket.off("newMessage")
}

useEffect(()=>
{
  subscribeToMessages();
  return ()=>unsubscribeFromMessages();
},[socket,selectedUser])


  const value = {
    messages,
    users,
    selectedUser,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    unseenMessages,
    setunseenMessages,setMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export { ChatProvider };
