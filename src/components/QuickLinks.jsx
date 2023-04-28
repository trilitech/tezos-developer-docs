import Link from 'next/link'
import { Icon } from '@/components/Icon'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-1 lg:grid-rows-6 lg:grid-flow-col lg:grid-cols-3 lg:gap-1">
        <h2 className="font-semibold text-lg text-slate-800 uppercase dark:text-white">Tezos Basics</h2>
        {children.slice(0, Math.ceil(children.length / 3))}

        <h2 className="font-semibold text-lg text-slate-800 uppercase dark:text-white">NFTs, Gaming and DeFi</h2>
        {children.slice(Math.ceil(children.length / 3), Math.ceil(children.length / 3) * 2)}
 
        <h2 className="font-semibold text-lg text-slate-800 uppercase dark:text-white">DApp Development</h2>
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
          <Icon icon={icon} className="h-10 w-10 transition duration-250 ease-in-out transform-gpu group-hover:scale-110" />
        </div>
        <div className="flex-grow">
          <h2 className="mt-4 font-display font-bold text-sm text-slate-700 dark:text-white hover:text-blue-800 hover:dark:hover:text-gray-400" style={{ lineHeight: '1.5rem' }}>
            {href === '' ? (
              <>
                {title}
                <span className="ml-2 block sm:inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xxs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10 dark:ring-white dark:bg-transparent dark:text-white">Coming Soon</span>
              </>
            ) : (
              <Link href={href}>
                <span className="absolute -inset-px rounded-xl" />
                {title}
              </Link>
            )}
          </h2>
          <p className="mt-1 text-xs text-slate-700 dark:text-slate-400" style={{ height: '3rem', overflow: 'hidden' }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

