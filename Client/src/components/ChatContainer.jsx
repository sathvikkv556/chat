import React, { useContext, useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
const ChatContainer = () => {
  const scrollEnd = useRef();
  const {
    selectedUser,
    setSelectedUser,
    messages,
    sendMessage,
    getMessages,
    setMessages,
  } = useContext(ChatContext);
  const { authUser, onlineUser, axios } = useContext(AuthContext);

  const [input, setInput] = useState("");
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("select a image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const deleteMessage = async (msgId) => {
    try {
      const res = await axios.delete(`/api/messages/${msgId}`);
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
        toast.success("Message deleted");
      }
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const currentUserId = "680f50e4f10f3cd28382ecf9"; // YOU (sender)

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>

        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img src={assets.help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>

      {/* Chat Area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => {
          const isSender = msg.senderId === authUser._id;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-4 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar and Time (Receiver Left / Sender Right) */}
              {!isSender && (
                <div className="text-center text-xs">
                  <img
                    className="w-7 rounded-full"
                    src={selectedUser?.profilePic || assets.avatar_icon}
                    alt="Receiver"
                  />
                  <p className="text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}

              {/* Message Bubble */}
              {msg.image ? (
                <img
                  src={msg.image}
                  alt=""
                  onClick={() => isSender && deleteMessage(msg._id)}
                  className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden cursor-pointer"
                />
              ) : (
                <p
                  onClick={() => isSender && deleteMessage(msg._id)}
                  className={`p-2 max-w-[200px] md:text-sm font-light break-all text-white rounded-lg cursor-pointer
    ${
      isSender
        ? "bg-violet-600/40 rounded-bl-none"
        : "bg-stone-500/40 rounded-br-none"
    }`}
                >
                  {msg.text}
                </p>
              )}

              {isSender && (
                <div className="text-center text-xs">
                  <img
                    className="w-7 rounded-full"
                    src={
                      msg.senderId === authUser._id
                        ? authUser?.profilePic || assets.avatar_icon
                        : selectedUser?.profilePic || assets.avatar_icon
                    }
                    alt="Sender"
                  />
                  <p className="text-gray-500">
                    {formatMessageTime(msg.createdAt)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>
      </div>
      {/* bottom area */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-white/10 px-3 py-2 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
            type="text"
            placeholder="Send a Message"
            className="flex-1 text-sm p-2 bg-transparent border-none outline-none text-white placeholder-gray-400"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={assets.gallery_icon}
              alt=""
              className="w-5 mr-2 cursor-pointer"
            />
          </label>
        </div>

        <img
          onClick={handleSendMessage}
          src={assets.send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="" />
      <p className="text-lg font-medium text-white">Chat Anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
