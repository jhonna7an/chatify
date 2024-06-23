import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

import { BiSolidSend } from "react-icons/bi";
import { LuPaperclip } from "react-icons/lu";
import { useState, useContext } from "react";
import supabase from "@/configurations/supabase";
import { UserContext } from "@/context/userContext";
import { CodeSelector } from "./CodeSelector";

export const MessageForm = () => {
  const { user, session } = useContext(UserContext); 

  const [ message, setMessage ] = useState("");
  const [ isSending, setIsSending ] = useState(false);
  const [ formatType, setFormatType ] = useState("text");
  const [ file, setFile ] = useState(null);
  const [ filePreview, setFilePreview ] = useState(null);

  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) return;

    setIsSending(true);

    setMessage("");

    try {
      const { error } = await supabase.from("messages").insert([
        {
          text: message,
          username: user.userName,
          is_authenticated: session ? true : false,
          format_type: formatType
        },
      ]);

      if (error) {
        toast({
          description: error.message
        });
        
        return;
      }
    } catch (error) {
      console.log("error sending message:", error); 
    } finally {
      setIsSending(false);
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
      console.log('render', filePreview);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  return (
    <div className="flex w-full items-center space-x-2 pt-4">
      <form onSubmit={ handleSubmit } autoComplete="off"
        className="flex gap-2 w-full">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />

        <label htmlFor="file-input" className="flex items-center hover:bg-accent cursor-pointer px-2 rounded-full">
          <LuPaperclip className="text-xl" />
        </label>
        
        <CodeSelector setFormatType={ setFormatType } messageSended={ isSending }/>

        <Input type="text" 
          placeholder="Escribe un mensaje" 
          className="focus-visible:ring-0"
          onChange={(e) => setMessage(e.target.value)}
          value={ message }
        />
        <Button type="submit" disabled={ !message }>
          <BiSolidSend className="text-2xl"/>
        </Button>
      </form>
    </div>
  )
}
