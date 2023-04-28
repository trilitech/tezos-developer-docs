import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

// import { Hero } from '@/components/Hero'
import { Logo, Logomark } from '@/components/Logo'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { Search } from '@/components/Search'
import { ThemeSelector } from '@/components/ThemeSelector'

const navigation = [
  {
    title: 'Tezos Basics',
    links: [
      { title: 'Tezos Blockchain Overview', href: '/tezos-blockchain-overview/tezos-blockchain-overview' },
      { title: 'Get Started with Octez', href: '/tezos-basics/get-started-with-octez/get-started-with-octez' },
      { title: 'Deploy your first smart contract', href: '/tezos-basics/deploy-your-first-smart-contract/first-smart-contract' },
      { title: 'Tezos Protocol & Shell', href: '/tezos-basics/tezos-protocol-and-shell/tezos-protocol-and-shell' },
      { title: 'Test Networks', href: '/tezos-basics/test-networks/test-networks' },
      { title: 'Smart Contract Languages', href: '/tezos-basics/smart-contract-languages/smart-contract-languages' },
    ],
  },
  {
    title: 'NFTs, Gaming and DeFi',
    links: [
      { title: 'DeFi Tokens', href: '/defi/defi-tokens/defi-tokens' },
      { title: 'Create an NFT', href: '/nft/create-an-nft/create-an-nft' },
      { title: 'Build an NFT Marketplace', href: '/nft/build-an-nft-marketplace/build-an-nft-marketplace' },
      { title: 'Tezos SDK for Unity', href: '/gaming/tezos-sdk-for-unity/tezos-sdk-for-unity' },
      // { title: 'Build a Game on Tezos', href: '/gaming/build-a-game-on-tezos/build-a-game-on-tezos' },
    ],
  },
  {
    title: 'Dapp Development',
    links: [
      { title: 'Build your first DApp', href: '/dapp-development/build-your-first-dapp/build-your-first-dapp' },
      { title: 'Taquito', href: '/dapp-development/taquito/taquito' },
      { title: 'Indexers', href: '/dapp-development/indexers/indexers' },
      { title: 'Wallets and Beacon SDK', href: '/dapp-development/wallets-and-beacon-sdk/wallets-and-beacon-sdk' },
      { title: 'Framework Best Practices', href: '/dapp-development/framework-best-practices/framework-best-practices/' },
    ],
  },
]

function GitHubIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  )
}

function Header({ navigation }) {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-slate-900 px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none dark:border-b-2 sm:px-6 lg:px-8',
        isScrolled
          ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="mr-6 flex lg:hidden">
        <MobileNavigation navigation={navigation} />
      </div>
      <div className="relative flex flex-grow basis-0 items-center">
        <Link href="/" aria-label="Home page">
          <Logomark className="h-8 w-8 inline-flex" />
          <h1 className="hidden h-8 w-auto fill-slate-700 dark:fill-sky-100 lg:inline-flex text-white dark:text-white text-xl" >
          Tezos Docs
          <span class="inline-flex items-center rounded-md bg-transparent px-1.5 py-0.5 m-2 text-xxs text-white ring-1 ring-inset ring-white dark:text-white dark:bg-transparent dark:ring-white">Beta</span>
          </h1>
        </Link>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
        <ThemeSelector className="relative z-10" />
        <Link
          href="https://github.com/trilitech/docs-staging"
          target="_blank"
          rel="noopener noreferrer"
          className="group"
          aria-label="GitHub"
        >
          <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-300" />
        </Link>
      </div>
    </header>
  )
}

function useTableOfContents(tableOfContents) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  let getHeadings = useCallback((tableOfContents) => {
    return tableOfContents
      .flatMap((node) => [node.id, ...node.children.map((child) => child.id)])
      .map((id) => {
        let el = document.getElementById(id)
        if (!el) return

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    let headings = getHeadings(tableOfContents)
    function onScroll() {
      let top = window.scrollY
      let current = headings[0].id
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  return currentSection
}

export function Layout({ children, title, tableOfContents }) {
  let router = useRouter()
  let isHomePage = router.pathname === '/'
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  )
  let currentSection = useTableOfContents(tableOfContents)

  function isActive(section) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <>
      <Header navigation={navigation} />

      {isHomePage }
      
      <div className="relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12">
       
       {!isHomePage && ( 
        // Don't show the left sidebar on the homepage

        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
          <div className="absolute top-16 bottom-0 right-0 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
          <div className="absolute top-28 bottom-0 right-0 hidden w-px bg-slate-800 dark:block" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>

        )}

        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            {(title || section) && (
              <header className="mb-6 space-y-1">
                {section && !isHomePage &&  (
                  <p className="font-display text-sm font-medium text-blue-600">
                    {section.title}
                  </p>
                )}
                {title && (
                  <h1 className="font-display font-semibold text-4xl text-gradient dark:text-white">
                    {title}
                  </h1>
                )}
              </header>
            )}
            <Prose>{children}</Prose>
          </article>

          {!isHomePage && (
          // Don't show the previous and next links on the homepage

          <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
            {previousPage && (
              <div>
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <span aria-hidden="true">&larr;</span> {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {nextPage.title} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
          )}
        </div>

        {!isHomePage && (
        // Don't show the right sidebar on the homepage

        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            {tableOfContents.length > 0 && (
              <>
                <h2
                  id="on-this-page-title"
                  className="font-display text-sm font-medium text-slate-900 dark:text-white"
                >
                  On this page
                </h2>
                <ol role="list" className="mt-4 space-y-3 text-sm">
                  {tableOfContents.map((section) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={clsx(
                            isActive(section)
                              ? 'text-blue-600'
                              : 'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400"
                        >
                          {section.children.map((subSection) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={
                                  isActive(subSection)
                                    ? 'text-blue-600'
                                    : 'hover:text-slate-600 dark:hover:text-slate-300'
                                }
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>

        )}
        
      </div>
      <footer class="bg-slate-900 dark:border-t-2">
        <div class="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          

          <div class="md:mb-2 md:inline-flex lg:flex-wrap md:flex flex-wrap gap-y-2 flex w-30 md:w-1/2 2xl:flex-nowrap"><a href="https://twitter.com/tezos" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M25.247 10.715a7.305 7.305 0 01-2.096.574 3.658 3.658 0 001.604-2.02c-.716.426-1.5.726-2.317.886a3.65 3.65 0 00-6.217 3.329 10.362 10.362 0 01-7.522-3.813 3.65 3.65 0 001.13 4.872 3.64 3.64 0 01-1.653-.457v.047a3.65 3.65 0 002.927 3.579 3.675 3.675 0 01-1.648.062 3.65 3.65 0 003.41 2.533A7.322 7.322 0 017.46 21.82a10.32 10.32 0 005.593 1.64c6.713 0 10.382-5.56 10.382-10.382 0-.157-.004-.315-.01-.472a7.417 7.417 0 001.819-1.888l.002-.002z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Twitter</span></a><a href="https://t.me/tezosplatform" target="_blank" rel="noopener noreferrer" class="tooltip-space mx-1 xl:mx-3 mb-3 "><svg class="hover:opacity-60" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M21.92 9.085L7.747 14.38c-.967.377-.962.9-.177 1.132l3.638 1.1 8.42-5.146c.398-.235.761-.108.462.149l-6.82 5.964h-.002.001l-.25 3.634c.367 0 .53-.163.735-.356l1.768-1.665 3.676 2.63c.678.362 1.165.176 1.334-.607l2.413-11.019c.247-.96-.378-1.394-1.025-1.11z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Telegram</span></a><a href="https://discord.gg/yXaPy6s5Nr" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M14.592 13.97c-.542 0-.969.476-.969 1.056 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055.011-.581-.427-1.055-.968-1.055zm3.468 0c-.542 0-.969.476-.969 1.056 0 .578.437 1.055.969 1.055.541 0 .968-.477.968-1.055-.001-.581-.427-1.055-.968-1.055z"></path><path fill="#fff" d="M22.678 6H9.947A1.952 1.952 0 008 7.957v12.844c0 1.083.874 1.957 1.947 1.957H20.72l-.505-1.759 1.217 1.131 1.149 1.064L24.625 25V7.957A1.951 1.951 0 0022.678 6zM19.01 18.407s-.342-.408-.626-.771c1.244-.352 1.719-1.13 1.719-1.13-.39.256-.76.438-1.093.562a6.679 6.679 0 01-3.838.398 7.944 7.944 0 01-1.396-.41 5.399 5.399 0 01-.693-.321c-.029-.021-.057-.029-.085-.048a.116.116 0 01-.039-.03c-.171-.094-.266-.16-.266-.16s.456.76 1.663 1.121c-.285.36-.637.789-.637.789-2.099-.067-2.896-1.444-2.896-1.444 0-3.059 1.368-5.538 1.368-5.538 1.368-1.027 2.669-.998 2.669-.998l.095.114c-1.71.495-2.499 1.245-2.499 1.245s.21-.114.561-.275c1.016-.446 1.823-.57 2.156-.599.057-.009.105-.019.162-.019a7.756 7.756 0 014.778.893s-.751-.712-2.366-1.206l.133-.152s1.302-.029 2.669.998c0 0 1.368 2.479 1.368 5.538 0-.001-.807 1.376-2.907 1.443z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Discord</span></a><a href="https://github.com/tezos/tezos" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle><path fill="#fff" fill-rule="evenodd" d="M16 4C9.37 4 4 9.37 4 16c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0028 16c0-6.63-5.37-12-12-12z" clip-rule="evenodd"></path></svg><span class="sr-only">Github</span></a><a href="https://gitlab.com/tezos/tezos" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg class="" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M16 24l-2.946-9.226h5.892L16 24zm0 0l-7.075-9.226h4.13L16 24zm-7.075-9.226L16 24l-7.75-5.729a.631.631 0 01-.221-.694l.896-2.803zm0 0L10.7 9.217a.31.31 0 01.11-.156.3.3 0 01.47.156l1.774 5.557H8.925zM16 24l2.946-9.226h4.128L16 24zm7.074-9.226l.896 2.803a.631.631 0 01-.222.694L16 24l7.075-9.226zm0 0h-4.128l1.774-5.557a.31.31 0 01.11-.157.3.3 0 01.47.157l1.774 5.557z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">GitLab</span></a><a href="https://www.reddit.com/r/tezos" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" fill-rule="evenodd" d="M26 16c0 5.523-4.477 10-10 10S6 21.523 6 16 10.477 6 16 6s10 4.477 10 10zm-3.593-.785c.161.23.253.503.263.785a1.46 1.46 0 01-.81 1.33c.012.147.012.293 0 .44 0 2.24-2.61 4.06-5.83 4.06s-5.83-1.82-5.83-4.06a2.86 2.86 0 010-.44 1.46 1.46 0 111.61-2.39 7.14 7.14 0 013.9-1.23l.74-3.47a.31.31 0 01.37-.24l2.45.49a1 1 0 11-.13.61L17 10.65l-.65 3.12A7.12 7.12 0 0120.2 15a1.46 1.46 0 012.207.215zm-9.569 1.23a1.001 1.001 0 101.665 1.111 1.001 1.001 0 00-1.665-1.112zm3.172 4.075c.887.037 1.76-.195 2.47-.73a.28.28 0 00-.39-.4A3.28 3.28 0 0116 20a3.27 3.27 0 01-2.08-.63.27.27 0 00-.38.38 3.84 3.84 0 002.47.77zm1.734-2.648c.165.11.349.208.546.208a.999.999 0 001.01-1.04 1 1 0 10-1.556.832z" clip-rule="evenodd"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Reddit</span></a><a href="https://riot.tzchat.org/" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg class="" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M12.326 9a2.507 2.507 0 00-1.332.393l.008-.004a2.18 2.18 0 00-.861 1.024 1.966 1.966 0 00-.06 1.29l-.005-.014v10.165c0 1.189 1.052 2.146 2.352 2.146 1.3 0 2.352-.957 2.352-2.146v-2.146h1.28l2.579 3.364c.175.232.4.43.659.582.26.152.55.256.853.305.303.05.615.044.916-.017.301-.061.586-.176.839-.338.253-.16.47-.364.636-.6.167-.237.28-.502.334-.778.054-.277.047-.561-.02-.836a2.042 2.042 0 00-.37-.764l-1.632-2.129a5.45 5.45 0 001.584-1.851A4.96 4.96 0 0023 14.354c0-2.956-2.649-5.351-5.879-5.351h-4.725L12.326 9zm1.584.542h3.211c2.912.042 5.25 2.229 5.204 4.885a4.474 4.474 0 01-.5 1.972 4.897 4.897 0 01-1.343 1.612l-.313-.406a4.246 4.246 0 001.49-2.173 3.924 3.924 0 00-.14-2.56 4.356 4.356 0 00-1.717-2.03 5.008 5.008 0 00-2.681-.768h-2.735a2.333 2.333 0 00-.115-.166l.005.007a2.277 2.277 0 00-.364-.37l-.002-.003zm.715 1.062h2.496c2.272 0 4.11 1.677 4.11 3.75 0 .533-.123 1.06-.364 1.546s-.593.92-1.033 1.27l-.334-.436c2.376-1.985.84-5.596-2.379-5.598H14.7c0-.185-.026-.368-.077-.547l.003.015zm.002 1.074h2.494c.386.007.767.084 1.12.225.355.142.674.346.941.6.268.255.477.555.617.883.14.329.207.68.199 1.032a2.58 2.58 0 01-.86 1.843l-.168-.218a1.843 1.843 0 00-.19-.217c.398-.385.625-.89.637-1.419a2.059 2.059 0 00-.657-1.533 2.475 2.475 0 00-1.65-.664h-2.718c.099-.154.179-.33.235-.518l.002-.014h-.002zm-3.957.964c.168.156.36.289.57.394l.013.004v8.813c0 .141.03.281.09.412.058.13.145.248.254.348.11.1.24.18.383.233.143.054.296.082.45.082.638 0 1.165-.481 1.175-1.085v-3.207h1.63l.417.541h-1.466v2.676c-.075 2.067-3.438 2.067-3.516 0v-9.21zm3.516.098h2.936c.232 0 .463.04.678.121.215.08.41.2.574.35.165.15.295.328.384.524.088.196.133.407.133.619 0 .449-.198.854-.52 1.145a2.415 2.415 0 00-.564-.257c.155-.098.283-.23.37-.383a.992.992 0 00.042-.91 1.08 1.08 0 00-.258-.35 1.2 1.2 0 00-.385-.235 1.287 1.287 0 00-.454-.082H14.77v2.156h1.06a2.34 2.34 0 00-.648.53h-.995l-.001-3.228zm-.591.227v3.545h1.257a2.06 2.06 0 00-.136.53H13.01v-3.838c.222-.061.415-.142.591-.242l-.007.005zm-1.758.268c.157.037.337.054.522.054h.072v4.285h2.296c.03.18.08.356.163.53h-1.878v3.75a.526.526 0 01-.171.376.63.63 0 01-.41.165.637.637 0 01-.417-.152.537.537 0 01-.13-.173.495.495 0 01-.046-.205l-.001-8.63zm3.516.577h1.758c.33 0 .594.242.594.542 0 .303-.252.551-.583.551l-1.77-.01v-1.083z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Riot</span></a><a href="https://tezos.stackexchange.com/" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg class="" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><path fill="#fff" d="M22 19.386v.69c0 1.169-.932 2.116-2.07 2.116h-.605L16.599 25v-2.808H11.07c-1.138 0-2.07-.948-2.07-2.12v-.687h13zm-13-3.41h12.914v2.652H9v-2.652zm0-3.429h12.914V15.2H9v-2.653zM19.893 9c1.126 0 2.02.948 2.02 2.12v.688H9v-.688C9 9.948 9.935 9 11.072 9h8.822z"></path><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle></svg><span class="sr-only">Stack Exchange</span></a><a href="https://forum.tezosagora.org/" target="_blank" rel="noopener noreferrer" class="mx-1 xl:mx-3 mb-3 hover:opacity-60 "><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15.5" stroke="#fff"></circle><g clip-path="url(#clip0)"><path fill="#fff" d="M21.992 19.805c-.174-2.939-4.045-4.274-4.415-4.412-.016-.007-.016-.021-.008-.036l3.992-3.826v-.412c0-.065-.06-.123-.128-.123h-7.357V8l-2.715.542v.39h.151s.666 0 .666.635v1.422h-2.102c-.038 0-.076.036-.076.072v.903h2.185v4.902c0 1.538 1.036 2.607 2.85 2.462a2.325 2.325 0 001.044-.36.45.45 0 00.22-.383V18.1c-.59.376-1.09.354-1.09.354-1.149 0-1.126-1.394-1.126-1.394v-5.097h5.293l-3.81 3.668-.016.866c0 .015.008.022.023.022 3.493.563 4.438 2.722 4.438 3.35 0 0 .378 3.054-2.82 3.264 0 0-2.095.086-2.465-.715-.015-.03 0-.058.03-.072.348-.152.582-.448.582-.845 0-.592-.378-1.076-1.172-1.076-.642 0-1.172.484-1.172 1.076 0 0-.302 2.57 4.19 2.498 5.126-.087 4.808-4.195 4.808-4.195z"></path></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0H12V16H0z" transform="translate(10 8)"></path></clipPath></defs></svg><span class="sr-only">Tezos Agora</span></a></div>
        
          
          <div class="mb-2 md:order-1 md:mt-0">
            <p class="text-left lg:text-center text-sm leading-5 text-white hover:text-gray-300 "> <a href='/'>Return to Tezos.com</a> </p>
          </div>
          
        </div>
        <p class="pb-3 text-center text-sm leading-5 text-white hover:text-gray-300"> <a href="https://tezos.com/privacy-notice">Privacy Notice</a></p>
      </footer>
                              

    </>
    
  )
}
