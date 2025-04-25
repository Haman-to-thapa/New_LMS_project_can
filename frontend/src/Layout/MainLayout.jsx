import Navbar from '@/components/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className='pt-16'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout