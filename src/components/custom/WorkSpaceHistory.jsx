'use client'

import UserDetailsContext from '@/context/UserDetailsContext'
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { api } from '../../../convex/_generated/api'
import Link from 'next/link'
import { useSidebar } from '../ui/sidebar'
import { Link2 } from 'lucide-react'

const WorkSpaceHistory = () => {
    const convex = useConvex()
    const { userDetails, setUserDetails } = useContext(UserDetailsContext)
    const [workspaceList, setWorkspaceList] = useState()
    const { toggleSidebar } = useSidebar()

    useEffect(() => {
        GetAllWorkSpace()
    }, [userDetails])

    const GetAllWorkSpace = async () => {
        const result = await convex.query(api.workspace.GetAllWorkspaces, {
            userId: userDetails?._id
        })
        setWorkspaceList(result)
    }

    return (
        <div className=''>
            <h2 className='font-medium text-lg w-full px-6'>Your Previous Chats</h2>
            {
                workspaceList && workspaceList.length > 0 ? (workspaceList.map((wp, index) => (
                    <Link key={index} onClick={toggleSidebar} href={`/workspace/${wp?._id}`}>

                        <h2 className='px-6 text-sm text-gray-400 font-light mt-2 cursor-pointer hover:text-white'>{wp.message[0].content} </h2>


                    </Link>
                ))) : <h2>No Previous Chats</h2>
            }
        </div>
    )
}

export default WorkSpaceHistory