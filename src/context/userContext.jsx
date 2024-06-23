import { createContext, useState, useEffect } from 'react'
import supabase from '@/configurations/supabase';

export const UserContext = createContext();

export const UserContextProvider = ({ children}) => {

  const [ session, setSession] = useState(null);
  const [ user, setUser ] = useState({});
  const [ channel, setChannel ] = useState(null);

  const initializeUser = (session) => {
    setSession(session);
  
    let username;
    if (session) {
      username = {
        userName: session.user.user_metadata.user_name,
        avatar: session.user.user_metadata.avatar_url
      };
      localStorage.setItem("user", username);
    } else {
      username = localStorage.getItem("user");
    }
    setUser(username);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      initializeUser(session);
    });

    // getMessagesAndSubscribe();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      initializeUser(session);
    });

    return () => {
      // Remove supabase channel subscription by useEffect unmount
      if (channel) {
        supabase.removeChannel(channel);
      }

      authSubscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{
        user,
        session,
        channel,
        setChannel
    }}>
        { children }
    </UserContext.Provider>
  )
}

