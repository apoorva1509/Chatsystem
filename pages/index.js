import Chat from "@/components/chat";
import Head from "next/head";
import custombg from "/styles/bg.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { animateScroll as scroll } from 'react-scroll';
import { ClockLoader } from 'react-spinners';
import SelectSource from "@/components/selectSource";

const prompts = 
  {
      name: "AI assistant",
      request : {
        model: "text-davinci-003",
        prompt: "",
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: [" Human:", " AI:"],
      }
  }

export {prompts}; 

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  // const [currentPrompt, setCurrentPrompt] = useState(`AI assistant`);
  const [userInput,setUserInput] = useState("");
  const messageType = {me: "me", openAI: "openAI"};
  const currentPrompt = `AI assistant`
  const [openDrive, setOpenDrive] = useState(false);

  useEffect(() => {
    scroll.scrollToBottom({
        containerId: "chat",
        duration: 250,
      });
  }, [messages])

  function clearChat() {
    setMessages([]);
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    const instructionPrompt = `The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
    \nHuman: Hello, who are you?
    \nAI: I am an AI created by OpenAI. How can I help you today?
    \nHuman: ${userInput}
    \nAI:`
    let tempMessages = [...messages, {user: `${messageType.me}`, message: `${userInput}`}];
    setMessages(tempMessages);
    setUserInput("");

    try {
      const response = await fetch("api/generate",{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({input: `${messages.length === 0 ? instructionPrompt : tempMessages.map(m => m.message).join(" ")}`, prompt: currentPrompt})
      });
      
      // If we get unsuccessful response
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setMessages([...tempMessages, {user: messageType.openAI, message: `${data.openAI && data.openAI.trimStart()}`, image: data.image }]);
      // Set loading animation to false
      setLoading(false);
    } 
    catch (error) {
      // Set loading animation to false
      setLoading(false);
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <>
      <Head>
          <title>ChatGPT</title>
          <link rel="icon" href="/openai.png"/>
      </Head>
      <div className={`w-full min-h-full ${custombg.customBg}`}>
        <div className="flex">
          <div className="bg-gray-800 h-screen w-1/5 p-2">
            <div>
              <div>
                <div className="text-gray-100 flex items-center text-xl p-3  bg-gray-900 rounded-md border border-slate-600 shadow-md m-1 hover:bg-gray-700" onClick={clearChat}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                    </svg>
                    <h2 className="text-sm px-1">
                        New chat
                    </h2>
                </div>
              </div>
            </div>
          </div> 
          <div className="w-4/5 relative">
            <div id="chat" className="h-[90vh] overflow-auto scrollbar">
              {messages.length > 0 && 
                messages.map((user, index)=>(
                  <Chat key={index} user={user}/>
                ))
              }
            </div>
            <div>
              <div className="p-5 absolute bottom-0 right-0 left-0">
                <div className="flex-shrink-0">
                  <button
                    className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100"
                    onClick={() => {setOpenDrive(true)
                    }}
                    disabled={loading}
                  >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-plus"
                    viewBox="0 0 16 16"
                  >
                    {" "}
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />{" "}
                  </svg>
                  </button>
                </div>
                <div className="flex justify-center mb-2">
                  {/* ClocLoader */}
                  <ClockLoader size={20} color={"#F3F4F6"} loading={loading} />
                </div>
                <form className="relative" onSubmit={submit}>
                  <input 
                    type="text"
                    placeholder="Start chatting"
                    value={userInput} 
                    required
                    onChange={(e)=>setUserInput(e.target.value)} 
                    rows="1" 
                    className="block p-2.5 w-full text-sm text-gray-50 bg-gray-700 rounded-lg focus:outline-none ring-gray-500 focus:border-gray-500 shadow-md"
                  />  
                  <button type="submit" className="right-2 bottom-3 absolute pr-2" >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gray" className="w-5 h-5">
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                </form> 
              </div>
            </div>
          </div> 
        </div> 
      </div>
      {openDrive?<SelectSource/>:<></>}
    </>
  )
}