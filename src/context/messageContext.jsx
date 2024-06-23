/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useContext, useEffect, useRef } from "react";
import { UserContext } from "./userContext";
import supabase from "@/configurations/supabase";

export const MessageContext = createContext();

export const MessageContextProvider = ({ children }) => {

  const { user, channel, setChannel } = useContext(UserContext);

  const [ error, setError ] = useState("");
  const [ messages, setMessages ]= useState([]);
  const [ newIncomingMessageTrigger, setNewIncomingMessageTrigger ] = useState(null);
  const [ initialLoading, setLoadingInitial ] = useState(false);
  const [ unviewedMessageCount, setUnviewedMessageCount ] = useState(0);
  const [ isOnBottom, setIsOnBottom ] = useState(false);

  const getMessagesAndSubscribe = async () => {
    setError("");

    await getInitialMessages();

    if (!channel) {
      const myChannel = supabase
        .channel("custom-all-channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "messages" },
          (payload) => {
            handleNewMessage(payload);
          }
        )
        .subscribe();

      setChannel(myChannel);
    }
  };

  const handleNewMessage = (payload) => {
    setMessages((prevMessages) => [ payload.new, ...prevMessages ]);
    //* needed to trigger react state because I need access to the username state
    setNewIncomingMessageTrigger(payload.new);
  };

  const getInitialMessages = async () => {
    if (messages.length) return;

    setLoadingInitial(true);

    const { data, error } = await supabase
      .from("messages")
      .select()
      .range(0, 50)
      .order("id", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setLoadingInitial(false);
    setMessages(data);
    scrollToBottom();
  };
  
  useEffect(() => {
    getMessagesAndSubscribe();
  }, []);

  useEffect(() => {
    if (!newIncomingMessageTrigger) return;

    if (newIncomingMessageTrigger.username === user.userName) {
      scrollToBottom();
    } else {
      setUnviewedMessageCount((prevCount) => prevCount + 1);
    }
  }, [newIncomingMessageTrigger]);

  const scrollRef = useRef();
  const onScroll = async ({ target }) => {
    // if (target.scrollHeight - target.scrollTop <= target.clientHeight + 1) {
    if (target.scrollTop + target.clientHeight === target.scrollHeight) {
      setUnviewedMessageCount(0);
      setIsOnBottom(true);
    } else {
      setIsOnBottom(false);
    }

    //* Load more messages when reaching top
    if (target.scrollTop === 0) {
      // console.log("messages.length :>> ", messages.length);
      const { data, error } = await supabase
        .from("messages")
        .select()
        .range(messages.length, messages.length + 49)
        .order("id", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      target.scrollTop = 1;
      setMessages((prevMessages) => [...prevMessages, ...data]);
    }
  };

  const scrollToBottom = () => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <MessageContext.Provider value={{
      error,
      messages,
      initialLoading,
      scrollRef,
      onScroll,
      scrollToBottom,
      getMessagesAndSubscribe,
      unviewedMessageCount,
      isOnBottom
    }}>
      { children }
    </MessageContext.Provider>
  );
} 