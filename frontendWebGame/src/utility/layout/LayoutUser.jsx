import React from 'react'
import Header from '../../pages/home/header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../../pages/home/footer/Footer'

const LayoutUser = () => {
  return (
    <>
    <Header/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default LayoutUser
