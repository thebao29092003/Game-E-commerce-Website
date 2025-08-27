import React from 'react'
import { icons } from '../../assets/icons/icons'
import "./ErrorPage.css"

const ErrorPage = () => {
  return (
    <div className='error-page'>
      <img src={icons.sad} alt="Lỗi hiển thị" />
      <h1>404</h1>
      <h3>Không tìm thấy trang</h3>
      <p>Xin lỗi, trang bạn tìm kiếm hiện không tồn tại
      </p>
    </div>
  )
}

export default ErrorPage
