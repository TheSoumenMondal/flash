'use client'

import { ArrowRight, Link } from 'lucide-react'
import React, { useContext, useState } from 'react'
import data from '../../../data/data'
import MessagesContext from '@/context/MessagesContext'
import UserDetailsContext from '@/context/UserDetailsContext'
import SignInDialog from './SignInDialog'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useRouter } from 'next/navigation'

const Hero = () => {

  const [userInput, setUserInput] = useState("")
  const { messages, setMessages } = useContext(MessagesContext)
  const { userDetails, setUserDetails } = useContext(UserDetailsContext)
  const [openDialog, setOpenDialog] = useState(true)

  const createWorkSpace = useMutation(api.workspace.workspace)

  const router = useRouter()

  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true)
      return
    }
    const msg = {
      role: "User",
      content: input
    }
    setMessages(msg)
    const workspaceId = await createWorkSpace({
      user: userDetails._id,
      message: [msg]
    })
    console.log(workspaceId)

    router.push(`/workspace/${workspaceId}`)

  }

  return (
    <div className='flex flex-col items-center mt-36 gap-2 select-none'>
      <h2 className='font-bold text-4xl'>What do you want to build ?</h2>
      <p className='text-gray-400 font-medium'> prompt and make your idea real</p>
      <div className="relative p-5 rounded-xl max-w-xl w-full mt-3 bg-stone-900 inputField">
        <div className="flex gap-2">
          <textarea
            onChange={(e) => setUserInput(e.target.value)}
            className="outline-none h-32 resize-none w-full max-h-56 bg-transparent"
            placeholder="What you want to build ?"
          />
          {userInput && (
            <ArrowRight
              onClick={() => onGenerate(userInput)}
              className="bg-sky-500 p-2 h-8 w-8 rounded-md cursor-pointer"
            />
          )}
        </div>
        {/* <Link className="w-5 h-5" /> */}

        <div className="inner">

          <svg
            className="icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
          >
            <polyline
              points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"
            ></polyline></svg>
        </div>


      </div>


      <div className='flex items-center flex-wrap gap-2 max-w-2xl justify-center'>
        {data.suggestions.map((suggestions, index) => {
          return (
            <p key={index} onClick={() => onGenerate(suggestions)} className='px-2 border rounded-2xl text-gray-400 hover:text-white cursor-pointer'>{suggestions}</p>
          )
        })}
      </div>
      <SignInDialog openDialog={openDialog} closedialog={(v) => setOpenDialog(v)} />
    </div>
  )
}

export default Hero