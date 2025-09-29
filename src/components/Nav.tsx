import React from 'react'
import Header from "./Header";
import Text from './Text'
import '../App.css'

export default function Nav() {
  return (
    <div className='nav'>
      
            <Header />
      <Text
      variant='h1'
      className='sidebar-heading'
      >Menu</Text>

      <ul>
        <li><Text variant='a' className='sidebar-link'>Home</Text></li>
        <li><Text variant='a' className='sidebar-link'>saved locations</Text></li>
        <li><Text variant='a' className='sidebar-link'>Hourly forecast</Text></li>
        <li><Text variant='a' className='sidebar-link'>Settings</Text></li>
        <li><Text variant='a' className='sidebar-link'>Notifications</Text></li>
        <li><Text variant='a' className='sidebar-link'>Privacy Policies </Text></li>
      </ul>

    </div>
  )
}
