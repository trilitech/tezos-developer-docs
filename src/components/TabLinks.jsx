import { useRouter } from 'next/router'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export function TabLinks({ isHomePage }) {
  const router = useRouter()
  const [isLargeScreen, setIsLargeScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1140)
    }

    // Check initial screen size
    checkScreenSize()

    window.addEventListener('resize', checkScreenSize)

    return () => {
      // Clean up event listener
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  return (
    <div className="flex flex-col custom:-ml-0 custom:flex-row custom:items-center">
      <Link
        href="/basics/overview"
        className={`px-4 py-2 -mr-1 ${
          router.pathname.includes('/basics')
            ? 'text-blue-400'
            : 'text-white'
        }`}
      >
        {isLargeScreen ? (
          <div className="hover:text-gray-300 dark:hover:text-gray-500">
            Basics
          </div>
        ) : (
          <h2
            className="font-display font-medium text-slate-900 hover:text-blue-400 dark:text-white"
            style={{ fontSize: '1.3em' }}
          >
            📚 Basics
          </h2>
        )}
      </Link>
      <Link
        href="/build/smart-contracts"
        className={`px-4 py-2 -mr-1 ${
          router.pathname.includes('/build')
            ? 'text-blue-400'
            : 'text-white'
        }`}
      >
        {isLargeScreen ? (
          <div className="hover:text-gray-300 dark:hover:text-gray-500">
            Build
          </div>
        ) : (
          <h2
            className="font-display font-medium text-slate-900 hover:text-blue-400 dark:text-white"
            style={{ fontSize: '1.3em' }}
          >
            🔧 Build
          </h2>
        )}
      </Link>
      <Link
        href="/participate/get-started-with-octez"
        className={`px-4 py-2 -mr-1 ${
          router.pathname.includes('/participate')
            ? 'text-blue-400'
            : 'text-white'
        }`}
      >
        {isLargeScreen ? (
          <div className="hover:text-gray-300 dark:hover:text-gray-500">
            Participate
          </div>
        ) : (
          <h2
            className="font-display font-medium text-slate-900 hover:text-blue-400 dark:text-white"
            style={{ fontSize: '1.3em' }}
          >
            🤝 Participate
          </h2>
        )}
      </Link>
      <Link
        href="/learn"
        className={`px-4 py-2 -mr-1 ${
          router.pathname.includes('/tutorials')
            ? 'text-blue-400'
            : 'text-white'
        }`}
      >
        {isLargeScreen ? (
          <div className="hover:text-gray-300 dark:hover:text-gray-500">
            Learn
          </div>
        ) : (
          <h2
            className="font-display font-medium text-slate-900 hover:text-blue-400 dark:text-white"
            style={{ fontSize: '1.3em' }}
          >
            🎓 Learn
          </h2>
        )}
      </Link>
      <Link
        href="/office-hours"
        className={`px-4 py-2 ${
          router.pathname.endsWith('office-hours')
            ? 'text-blue-400'
            : 'text-white'
        }`}
      >
        {isLargeScreen ? (
          <div className="hover:text-gray-300 dark:hover:text-gray-500">
            Support
          </div>
        ) : (
          <h2
            className="font-display font-medium text-slate-900 hover:text-blue-400 dark:text-white"
            style={{ fontSize: '1.3em' }}
          >
           🛎️ Support
          </h2>
        )}
      </Link>
    </div>
  )

  // return (
  //   <div className="ml-6 flex flex-col custom:flex-row">
  //     <Link
  //       href="/tezos-blockchain-overview/"
  //       className={`px-4 py-2 ${
  //         (!router.pathname.includes('tutorials') &&
  //         !router.pathname.includes('office-hours') &&
  //         !isHomePage)
  //           ? 'text-blue-400'
  //           : 'text-white'
  //       } hover:text-gray-300 dark:hover:text-gray-500`}
  //     >
  //       Documentation
  //     </Link>
  //     <Link
  //       href="/tutorials"
  //       className={`px-4 py-2 ${
  //         router.pathname.includes('/tutorials')
  //           ? 'text-blue-400'
  //           : 'text-white'
  //       } hover:text-gray-300 dark:hover:text-gray-500`}
  //     >
  //       Tutorials
  //     </Link>
  //     <Link
  //       href="/office-hours"
  //       className={`px-4 py-2 ${
  //         router.pathname.endsWith('office-hours')
  //           ? 'text-blue-400'
  //           : 'text-white'
  //       } hover:text-gray-300 dark:hover:text-gray-500`}
  //     >
  //       Office Hours
  //     </Link>
  //   </div>
  // );
}
