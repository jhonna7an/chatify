import { useContext, useState } from "react";
import { UserContext } from "@/context/userContext";
import { MessageContext } from "@/context/messageContext";
import { MessageItem } from "./MessageiItem";

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { Loader2 } from "lucide-react"
import { AlertCircle } from "lucide-react"

export const MessageBox = () => {
  const { user, error } = useContext(UserContext);
  const { messages, initialLoading, getMessagesAndSubscribe } = useContext(MessageContext);

  const messageReversed = [ ...messages ].reverse();

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          { error }
          <Button
            ml="5px"
            onClick={ getMessagesAndSubscribe }
            colorScheme="red"
            variant="link">
            Reintentar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Cargando...
      </div>
    )
  }

  if (!messages.length)
    return (
      <div>
        No messages 😞
      </div>
    );

  return (
    user ?
    messageReversed.map(m => {
      const isYou = user.userName == m.username;
      return <MessageItem key={m.id} isYou={isYou} { ...m }/>
    }) : (
      <span>Inicie sesión para ver los mensajes</span>
    )
  )
}
