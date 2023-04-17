import Link from 'next/link'
import { Icon } from '@/components/Icon'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 sm:grid-rows-6 sm:grid-flow-col sm:grid-cols-3 sm:gap-1">
        <h2 className="font-semibold text-base">Tezos Basics</h2>
        {children.slice(0, Math.ceil(children.length / 3))}

        <h2 className="font-semibold text-base">NFTs and Gaming</h2>
        {children.slice(Math.ceil(children.length / 3), Math.ceil(children.length / 3) * 2)}
 
        <h2 className="font-semibold text-base">DApp Development</h2>
        {children.slice(Math.ceil(children.length / 3) * 2)}

    </div>
  )
}

export function QuickLink({ title, description, href, icon }) {
  return (
    <div className="relative flex items-center h-20 pr-4">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0" />
      <div className="relative overflow-hidden rounded-xl p-2 flex justify-center h-full items-center">
        <div className="flex-shrink-0 mr-4">
          <Icon icon={icon} className="h-8 w-8 transition duration-250 ease-in-out transform-gpu group-hover:scale-110" />
        </div>
        <div className="flex-grow">
          <h2 className="mt-4 font-display font-senu text-sm text-slate-900 dark:text-white" style={{ lineHeight: '1.5rem' }}>
            <Link href={href}>
              <span className="absolute -inset-px rounded-xl" />
              {title}
            </Link>
          </h2>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-400" style={{ height: '3rem', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}