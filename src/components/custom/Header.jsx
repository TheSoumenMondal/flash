'use client'

import React from 'react'
import { Button } from '../ui/button'
import UserDetailsContext from '@/context/UserDetailsContext'

const Header = () => {

  const { userDetails, setUserDetails } = React.useContext(UserDetailsContext)

  return (
    <div className=' p-4 px-16 flex justify-between items-center'>
      <div className='font-bold pt-3 text-xl'>Flash <div className="inner ml-1">

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
      </div> </div>
      {!userDetails && <div className='flex gap-5'>
        <Button variant="ghost">Sign in</Button>
        <Button className="text-white bg-sky-500 hover:bg-sky-600">Get Started</Button>
      </div>}
    </div>
  )
}

export default Header