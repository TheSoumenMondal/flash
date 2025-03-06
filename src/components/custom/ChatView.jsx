'use client'
import MessagesContext from '@/context/MessagesContext'
import { useConvex, useMutation } from 'convex/react'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import UserDetailsContext from '@/context/UserDetailsContext'
import Image from 'next/image'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react'
import axios from 'axios'
import customprompt from '../../../data/customprompt'

const ChatView = () => {
  const { id } = useParams()
  const convex = useConvex()
  // Initialize messages to an empty array in your context state (if not already done)
  const { messages, setMessages } = useContext(MessagesContext) || { messages: [] }
  const { userDetails } = useContext(UserDetailsContext)
  const [userInput, setUserInput] = useState("")
  const [loading, setLoading] = useState(false)
  const UpdateMessages = useMutation(api.workspace.updateMessages)

  useEffect(() => {
    GetWorkSpaceDate()
  }, [id])

  // Get workspace data using workspace id
  const GetWorkSpaceDate = async () => {
    const result = await convex.query(api.workspace.getWorkSpace, {
      workspaceId: id
    })
    // Ensure we have an array before setting state
    const messageArray = Array.isArray(result?.message)
      ? result.message
      : [result?.message].filter(Boolean)
    setMessages(messageArray)
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "User") {
        GetAIResponse()
      }
    }
  }, [messages])

  const GetAIResponse = async () => {
    setLoading(true)
    const PROMPT = JSON.stringify(messages) + customprompt.CHAT_PROMPT
    try {
      const result = await axios.post('/api/getchat', {
        prompts: { text: PROMPT }
      })
      const aiResp = { role: 'AI', content: result.data.result }
      // Create new messages array including the AI response
      const newMessages = [...messages, aiResp]
      setMessages(newMessages)
      await UpdateMessages({
        message: newMessages,
        workspaceId: id
      })
    } catch (error) {
      console.error("Error fetching AI response:", error)
    } finally {
      setLoading(false)
    }
  }

  const onGenerate = async (input) => {
    // Prevent generating a new message if already loading
    if (loading) return
    // Add the user's message to the chat
    setMessages(prev => [...prev, { role: 'User', content: input }])
    setUserInput('')
  }

  return (
    <div className='relative h-full flex flex-col'>

      <div className='flex-1 overflow-y-scroll scroll-smooth scrollbar-hide'>
        {Array.isArray(messages) ? (
          messages.map((message, index) => (
            <div key={index} className='bg-stone-900 p-3 rounded-lg mb-2 flex gap-2 items-start'>
              {message?.role === 'User' && (
                <Image
                  src={userDetails?.picture}
                  alt='user image'
                  width={35}
                  height={35}
                  className='rounded-full'
                />
              )}
              <h2>{message.content}</h2>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
        {loading && (
          <div className='bg-stone-900 p-3 rounded-lg mb-2 flex gap-2 items-start'>
            <Loader2Icon className='animate-spin' />
            <h2>Generating...</h2>
          </div>
        )}

      </div>




      {/* Input section */}
      <div className='p-5 border rounded-xl max-w-xl w-full mt-3 bg-stone-900'>
        <div className='flex gap-2'>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={loading} // disable input when loading
            className='outline-none h-32 resize-none w-full max-h-56 bg-transparent'
            placeholder='What do you want to build?'
          />
          {/* Disable the generate button when loading */}
          {userInput && !loading && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className='bg-sky-500 p-2 h-8 w-8 rounded-md cursor-pointer'
            />
          )}
        </div>
        <Link className='w-5 h-5'/>
      </div>
    </div>
  )
}

export default ChatView
