import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar"
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkSpaceHistory from './WorkSpaceHistory'
import Link from 'next/link'
const AppSideBar = () => {
    const {toggleSidebar} = useSidebar()
    return (

        <Sidebar>
            <SidebarHeader />
            <Link href={"/"} className='font-bold text-xl px-10 mb-6'>Flash</Link>
            <SidebarContent className="bg-transparent" >
                <Button className="w-[80%] ml-6"><Link href={"/"} onClick={toggleSidebar} className='flex flex-row gap-2 items-center' ><MessageCircleCode /> Start New Chat</Link></Button>
                <SidebarGroup />
                <WorkSpaceHistory />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>

    )
}

export default AppSideBar