'use client'
import React, { use, useContext, useEffect, useState } from 'react';
import { autocompletion, completionKeymap } from "@codemirror/autocomplete";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackFileExplorer } from '@codesandbox/sandpack-react';
import axios from 'axios';
import MessagesContext from '@/context/MessagesContext';
import customprompt from '../../../data/customprompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useParams } from 'next/navigation';
import { Download, Loader2Icon, Menu, Rocket } from 'lucide-react';
import UserDetailsContext from '@/context/UserDetailsContext';
import Image from 'next/image';
import { useSidebar } from '@/components/ui/sidebar'; // Import the hook
import SandPackClient from './SandPackClient';
import { Button } from '../ui/button';
import { ActionContext } from '@/context/ActionConext';

const initialFiles = {
  '/App.js': {
    code: "import React from 'react'\nfunction App() {\n return (\n<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', background: '#0D0D0D', color: '#fff' }}>\n<p>Made with 💖 by Soumen</p>\n       <a href=\"https://github.com/TheSoumenMondal\" target=\"_blank\" rel=\"noopener noreferrer\" style={{ color: '#61dafb', textDecoration: 'none', fontSize: '1.2rem' }}>TheSoumenMondal</a></div>); }\nexport default App"
  },
  '/index.css': {
    code: "body { margin: 0; font-family: sans-serif; }"
  },
  '/main.jsx': {
    code: "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './app';\nimport './index.css';\nReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);"
  }
};

const CodeView = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState(initialFiles);
  const { messages } = useContext(MessagesContext);
  const [loading, setIsLoading] = useState(false);
  const { userDetails } = useContext(UserDetailsContext);
  const { toggleSidebar } = useSidebar()
  const {action,setAction} = useContext(ActionContext)

  const UpdateFiles = useMutation(api.workspace.UpdateFiles);
  const convex = useConvex();

  useEffect(() => {
    getFiles();
  }, [id]);

  const getFiles = async () => {
    setIsLoading(true);
    const result = await convex.query(api.workspace.getWorkSpace, {
      workspaceId: id
    });
    if (!result) { console.log("No result"); return; }
    setFiles(result.fileData);
    setIsLoading(false);
  };

  const GenerateAiCode = async () => {
    setIsLoading(true);
    try {
      if (!messages?.length) return;
      const PROMPT = messages[messages.length - 1]?.content + ' ' + customprompt.CODE_GENERATOR_PROMPT;
      const result = await axios.post('/api/gencode', { prompts: PROMPT });
      if (!result?.data) { console.log("No result"); return; }
      const data = result.data;
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      const newFiles = { ...files, ...parsedData.files };

      if (parsedData.generatedFiles) {
        Object.entries(parsedData.generatedFiles).forEach(([fileName, code]) => {
          newFiles[`/${fileName}`] = { code };
        });
      }

      setFiles(newFiles);
      await UpdateFiles({
        workspaceId: id,
        files: parsedData?.files,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error generating code:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (messages?.length > 0) {
      let lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'Ai') { lastMessage = messages[messages.length - 2]; }
      if (lastMessage?.role === 'User') { console.log(lastMessage.content); GenerateAiCode(); }
    }
  }, [messages]);

  const onActionButton = (action) =>{
    setAction({
      actionType:action,
      timeStamp : Date.now()
    })
  }

  return (
    <div className="h-full w-full relative flex flex-col bg-[#0D0D0D]">
      <div className="flex items-center justify-between bg-[#121212] px-6 py-3 border-b border-gray-700 shadow-md">
        <div className="flex gap-3 bg-[#1E1E1E] px-2 py-1 rounded-full">
          <button onClick={() => setActiveTab('code')} className={`px-4 py-1 rounded-full text-sm transition ${activeTab === 'code' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Code</button>
          <button onClick={() => setActiveTab('preview')} className={`px-4 py-1 rounded-full text-sm transition ${activeTab === 'preview' ? 'bg-blue-500 text-white' : 'text-gray-400 hover:text-white'}`}>Preview</button>
        </div>

        <div className='flex gap-5 items-center'>
          <div className='gap-5 flex'>
            <Button onClick={()=>onActionButton('export')}variant={"ghost"} >Export <Download /></Button>
            <Button onClick={()=>onActionButton('deploy')} className='flex items-center gap-1 bg-sky-400 hover:bg-sky-600 cursor-pointer'>Deploy<Rocket/> </Button>
          </div>
          <div className='flex gap-5 items-center'>
          <button onClick={toggleSidebar}>
            <Menu className='cursor-pointer' />
          </button>
          <div>
            <Image
              src={userDetails?.picture}
              alt='user image'
              width={35}
              height={35}
              className='rounded-full'
            />
          </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <SandpackProvider template="react" theme="dark" files={files} options={{ externalResources: ['https://unpkg.com/@tailwindcss/browser@4'] }}>
          <SandpackLayout style={{ height: "80vh" }}>
            {activeTab === 'code' ? (
              <>
                <SandpackFileExplorer style={{ height: "80vh" }} />
                <SandpackCodeEditor style={{ height: "80vh" }} showTabs showLineNumbers={false} showInlineErrors wrapContent closableTabs extensions={[autocompletion()]} extensionsKeymap={completionKeymap} />
              </>
            ) : (
              <SandPackClient/>
            )}
          </SandpackLayout>
        </SandpackProvider>
      </div>
      {loading && (
        <div className='p-10 absolute bg-gray-900 opacity-75 top-0 rounded-lg w-full h-full flex items-center justify-center'>
          <Loader2Icon className='animate-spin h-10 w-10 text-white' />
          <h2>Generating your files...</h2>
        </div>
      )}
    </div>
  );
};

export default CodeView;