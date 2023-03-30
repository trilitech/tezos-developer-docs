import Link from 'next/link'
import { Icon } from '@/components/Icon'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-1 sm:grid-cols-3">
      {children}
    </div>
  )
}

export function QuickLink({ title, description, href, icon }) {
  return (
    <div className="relative flex items-center h-52">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0" />
      <div className="relative overflow-hidden rounded-xl p-6 flex justify-center h-full items-center">
        <div className="flex-shrink-0 mr-4">
          <Icon icon={icon} className="h-8 w-8 transition duration-250 ease-in-out transform-gpu group-hover:scale-110" />
        </div>
        <div className="flex-grow">
          <h2 className="mt-4 font-display font-senu text-base text-slate-900 dark:text-white" style={{ lineHeight: '1.5rem' }}>
            <Link href={href}>
              <span className="absolute -inset-px rounded-xl" />
              {title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-400" style={{ height: '3rem', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}