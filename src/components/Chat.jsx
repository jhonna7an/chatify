import { cn } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { FiChevronsDown } from "react-icons/fi";

import { MessageForm } from "./MessageForm";
import { useContext, useEffect, useState } from "react";
import { MessageContext } from "@/context/messageContext";
import { UserContext } from "@/context/userContext";

import { MessageBox } from "./MessageBox";

export function Chat({ className, ...props }) {
  const { user } = useContext(UserContext);
  const { onScroll, scrollRef, unviewedMessageCount, isOnBottom, scrollToBottom } = useContext(MessageContext);
  const [height, setHeight] = useState(window.innerHeight - 205);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight - 205);
    });
  }, []);

  return (
    <div className="flex w-full justify-center">
      <Card className={ cn("w-[800px]", className)} {...props}>
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>  
        <CardContent className="grid gap-4 h-[500px] overflow-auto px-10"
          onScroll={ onScroll }
          ref={ scrollRef }>
          <MessageBox />
          {
            !isOnBottom && (
              <div className="sticky bottom-2 flex justify-end items-center"
                onClick={ scrollToBottom }>
                {
                  unviewedMessageCount > 0 ? (
                    <Badge className="cursor-pointer rounded-full p-2 hover:bg-slate-600 flex">
                      { unviewedMessageCount }
                      <FiChevronsDown className="text-2xl"/>
                    </Badge>
                  ) : (
                    <span className="flex justify-end cursor-pointer bg-white p-2 rounded-full shadow-md m-[-2rem]">
                      <FiChevronsDown className="text-2xl"/>
                    </span>
                  )
                }
              </div>
            )
          }
        </CardContent>
        <CardFooter>
          <MessageForm/>
        </CardFooter>
      </Card>
    </div>
  )
}
