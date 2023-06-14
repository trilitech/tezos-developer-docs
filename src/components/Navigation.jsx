import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useState } from 'react'
import { FiChevronRight, FiChevronDown } from 'react-icons/fi'

function NavigationItem({ link }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = !!link.children

  return (
    <li key={link.href} className="relative">
      <div onClick={() => hasChildren && setIsOpen(!isOpen)}>
        <Link
          href={link.href}
          className={clsx(
            'block w-full pl-3.5',
            link.href === router.pathname
              ? 'font-semibold text-blue-600'
              : 'text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'
          )}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {link.title}
            {hasChildren &&
              (isOpen ? (
                <FiChevronDown
                  style={{ fontSize: '0.8em', marginLeft: '5px' }}
                />
              ) : (
                <FiChevronRight
                  style={{ fontSize: '0.8em', marginLeft: '5px' }}
                />
              ))}
          </div>
        </Link>
      </div>
      {/* Render nested links if they exist */}
      {hasChildren && isOpen && (
        <NavigationLinks links={link.children} isNested />
      )}
    </li>
  )
}

function NavigationLinks({ links, isNested = false }) {
  return (
    <ul
      role="list"
      style={{ listStylePosition: 'inside' }}
      className={clsx(
        'mt-2 space-y-2 lg:mt-4 lg:space-y-4',
        {
          'border-l-2 border-slate-100 dark:border-slate-800 lg:border-slate-200':
            !isNested,
        },
        { 'pl-4': isNested }
      )}
    >
      {links.map((link) => (
        <NavigationItem key={link.href} link={link} />
      ))}
    </ul>
  )
}

export function Navigation({ navigation, className }) {
  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={section.title}>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <NavigationLinks links={section.links} />
          </li>
        ))}
      </ul>
    </nav>
  )
}
