import React from 'react'
import Text from './Text'

export default function Nav() {
  return (
    <div className='nav'>
      <Text
      variant='h1'
      className='sidebar-heading'
      >Menu</Text>

      <ul>
        <li><Text variant='a' className='sidebar-link'>Home</Text></li>
        <li><Text variant='a' className='sidebar-link'>Cities</Text></li>
        <li><Text variant='a' className='sidebar-link'>Hourly forecast</Text></li>
        <li><Text variant='a' className='sidebar-link'>Settings</Text></li>
        <li><Text variant='a' className='sidebar-link'>About</Text></li>
      </ul>

    </div>
  )
}
