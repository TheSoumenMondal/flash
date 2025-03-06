'use client'

import React from 'react'
import { Button } from '../ui/button'
import UserDetailsContext from '@/context/UserDetailsContext'

const Header = () => {

  const { userDetails, setUserDetails } = React.useContext(UserDetailsContext)

  return (
    <div className=' p-4 px-16 flex justify-between items-center'>
      <p className='font-bold text-xl'>Flash⚡</p>
      {!userDetails && <div className='flex gap-5'>
        <Button  variant="ghost">Sign in</Button>
        <Button className="text-white bg-sky-500 hover:bg-sky-600">Get Started</Button>
      </div>}
    </div>
  )
}

export default Header