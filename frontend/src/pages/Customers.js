import React from 'react'
import Sidebar from '../components/Sidebar'
import Customers from '../components/Customer/Customers'

function Customer() {
  return (
    <div  style={{ display: "flex", minHeight: "100vh" }}>

        <Sidebar />
        <Customers />



    </div>
  )
}

export default Customer