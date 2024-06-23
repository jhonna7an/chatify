/* eslint-disable react/jsx-no-undef */
import './App.css'
import { Chat } from './components/Chat'
import { Header } from './components/Header';
import { UserContextProvider } from './context/userContext';
import { MessageContextProvider } from './context/messageContext';
import { Highlighter } from './components/Highlighter';
// import { ComboboxPopover } from './components/CodeSelector';

function App() {

  return (
    <UserContextProvider>
      <MessageContextProvider>
        < Header/>
        <Chat className="mt-6"/>
        {/* <Highlighter/> */}
        {/* <ComboboxPopover/> */}
      </MessageContextProvider>
    </UserContextProvider>
  );
}

export default App
