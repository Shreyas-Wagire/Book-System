import React from 'react'
import { Outlet } from 'react-router-dom'
import SideBar from './DashMenu'
import { DashMenu } from './DashMenu'

const DashboardLayout = () => {
  return (
    <div className='flex gap-4 flex-col md:flex-row'>
      <DashMenu/>
      <Outlet/>
    </div>
  )
}

export default DashboardLayout