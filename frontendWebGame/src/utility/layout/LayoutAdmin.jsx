import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../../pages/home/footer/Footer'
import HeaderAdmin from '../../pages/admin/headerAdmin/HeaderAdmin'

const LayoutUser = () => {
  return (
    <>
    <HeaderAdmin/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default LayoutUser
