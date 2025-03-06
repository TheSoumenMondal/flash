import Header from '@/components/custom/Header'
import Hero from '@/components/custom/Hero'
import React from 'react'

const page = () => {
  return (
    <>
    <div className='lg:hidden flex items-center justify-center w-full h-screen text-xl font-bold'>
      Please switch to a desktop screen
    </div>
      <div className='hidden w-full h-screen lg:flex flex-col'>
        <Header />
        <Hero />
      </div>
    </>
  )
}

export default page