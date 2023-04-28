import Link from 'next/link'
import { Icon } from '@/components/Icon'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-1 lg:grid-rows-[65px_repeat(5,_1fr)] lg:grid-flow-col lg:grid-cols-3 lg:gap-1">
        <div className="relative flex items-center h-fit max-h-10 pr-4">
          <h2 className="mt-4 font-semibold text-lg text-slate-800 uppercase dark:text-white">Tezos Basics</h2>
        </div>
        {children.slice(0, Math.ceil(children.length / 3))}

        <div className="mt-4 relative flex items-center h-fit max-h-10 pr-4">
          <h2 className="font-semibold text-lg text-slate-800 uppercase dark:text-white">NFTs, Gaming and DeFi</h2>
        </div>
        {children.slice(Math.ceil(children.length / 3), Math.ceil(children.length / 3) * 2)}

        <div className="mt-4 relative flex items-center h-fit max-h-10 pr-4">
          <h2 className="font-semibold text-lg text-slate-800 uppercase dark:text-white">DApp Development</h2>
        </div>
        {children.slice(Math.ceil(children.length / 3) * 2)}

    </div>
  )
}

export function QuickLink({ title, description, href, icon }) {
  return (
    <div className="relative flex items-center h-fit max-h-[4.75rem] pr-4">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0" />
      <div className="relative overflow-hidden rounded-xl p-2 flex justify-center h-full items-center">
        <div className="flex-shrink-0 mr-4">
          <Icon icon={icon} className="h-10 w-10 transition duration-250 ease-in-out transform-gpu group-hover:scale-110" />
        </div>
        <div className="flex-grow">
          <h2 className="mt-4 font-display font-bold text-sm text-slate-700 dark:text-white hover:text-blue-800 hover:dark:hover:text-gray-400" style={{ lineHeight: '1.5rem' }}>
            {href === '' ? (
              <>
                <div className="flow-root w-fit mb-0.5 items-center rounded-full bg-purple-50 px-1 py-0.5 text-xxs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10 dark:ring-white dark:bg-transparent dark:text-white">Coming Soon</div>
                {title}  
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

