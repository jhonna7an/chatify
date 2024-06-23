import { Button } from "@/components/ui/button"
import { IoLogoGithub } from "react-icons/io";
import supabase from "@/configurations/supabase";
import { useContext } from "react";
import { UserContext } from "@/context/userContext";

export const Header = () => {

  const { user, session } = useContext(UserContext);

  const onLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      redirectTo: window.location.origin
    });
  }

  const signOn = () => {
    const { error } = supabase.auth.signOut();
    if (error) return console.error("error signOut", error);
  }

  return (
    <nav className="h-12 pr-4 pl-4 shadow-md flex justify-between items-center">
      <h3 className="font-medium">Chatify</h3>
      <div className="flex justify-end items-center w-full h-full">
        {
          session ? (
            <>
              <div className="flex items-center mr-4">
                <img src={user.avatar} alt="avatar" width="30px" height="30px" className="rounded-full mr-2"/>
                <span>{ user.userName }</span>
              </div>
              
              <Button variant="ghost" 
                className="py-1 px-2 h-[2.1rem]"
                onClick={signOn}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button variant="outline" 
              onClick={onLogin}
              className="py-1 px-2 h-auto hover:bg-slate-900 hover:text-white">
              <IoLogoGithub className="text-2xl mr-1"/> Iniciar sesión
            </Button>
          )
        }
      </div>
    </nav>
  )
}
