import ChatView from '@/components/custom/ChatView'
import CodeView from '@/components/custom/CodeView'
import React from 'react'

const page = () => {
    return (
        <div className='p-10 w-full h-screen flex flex-row gap-6'>
            <div className='w-[28%]'>
            <ChatView/>
            </div>
            <div className='w-[72%]'>
            <CodeView/>
            </div>
        </div>
    )
}

export default page