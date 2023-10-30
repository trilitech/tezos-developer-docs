/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react'
import Link from '@docusaurus/Link'
import { Icon } from '@site/src/components/Icon'

export default function GridItem({ title, description, icon, href }) {
  return (
    <Link href={href} className="grid-link">
      <div className='grid-item'>
        <Icon className='grid-icon' icon={icon} />
        <div className='grid-text'>
          <div className='grid-title'>{title}</div>
          <p>{description}</p>
        </div>
      </div>
    </Link>
  )
}