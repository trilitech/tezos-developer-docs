import Link from 'next/link'
import { Icon } from '@/components/Icon'
import clsx from 'clsx'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose grid grid-cols-1 gap-1 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-[65px_repeat(5,_1fr)] lg:gap-1">
      <div className="relative flex h-fit max-h-10 items-center pr-4">
        <h2 className="mt-4 text-lg font-semibold uppercase text-slate-800 dark:text-white">
          Tezos Basics
        </h2>
      </div>
      {children.slice(0, Math.ceil(children.length / 3))}

      <div className="relative mt-4 flex h-fit max-h-10 items-center pr-4">
        <h2 className="text-lg font-semibold uppercase text-slate-800 dark:text-white">
          DeFi, NFTs and Gaming
        </h2>
      </div>
      {children.slice(
        Math.ceil(children.length / 3),
        Math.ceil(children.length / 3) * 2
      )}

      <div className="relative mt-4 flex h-fit max-h-10 items-center pr-4">
        <h2 className="text-lg font-semibold uppercase text-slate-800 dark:text-white">
          App Development
        </h2>
      </div>
      {children.slice(Math.ceil(children.length / 3) * 2)}
    </div>
  )
}

export function QuickLink({
  title,
  description,
  href,
  icon,
  comingSoon,
  isTutorial,
}) {
  const pathsToHideDescription = ['/tooling', '/resources']

  const shouldHideDescription = pathsToHideDescription.some((path) =>
    href.startsWith(path)
  )

  return (
    <div className="relative my-2 flex h-fit max-h-[4.75rem] items-center pr-4">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0" />
      <div className="relative flex h-full items-center justify-center overflow-hidden rounded-xl p-2">
        <div className="mr-2 flex-shrink-0">
          <Icon
            icon={icon}
            className="duration-250 h-10 w-10 transform-gpu transition ease-in-out group-hover:scale-110"
          />
        </div>
        <div className="flex-grow">
          <h2
            className={clsx(
              'font-display text-base font-bold',
              comingSoon
                ? 'text-slate-700 dark:text-white'
                : 'hover:text-blue-800 dark:hover:text-gray-400',
              !shouldHideDescription ? 'mt-4' : 'mt-1 mb-3'
            )}
            style={{
              lineHeight: !shouldHideDescription ? '1.5rem' : '1rem',
            }}
          >
            {comingSoon && (
              <div className="mb-0.5 flow-root w-fit items-center rounded-full bg-purple-50 px-1 py-0.5 text-xxs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/10 dark:bg-transparent dark:text-white dark:ring-white">
                Coming Soon
              </div>
            )}
            {isTutorial && (
              <div className="mb-0.5 flow-root w-fit items-center rounded-full bg-blue-50 px-1 py-0.5 text-xxs font-medium text-blue-800 ring-1 ring-inset ring-blue-600/10 dark:bg-transparent dark:text-white dark:ring-white">
                Tutorial
              </div>
            )}
            <Link href={href}>
              <span className="absolute -inset-px rounded-xl" />
              {title}
            </Link>
          </h2>
          {!shouldHideDescription && (
            <p
              className="mt-1 text-sm text-slate-700 dark:text-slate-400"
              style={{ height: '3rem', overflow: 'hidden' }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
