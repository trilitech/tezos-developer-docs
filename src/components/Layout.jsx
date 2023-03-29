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
      { title: 'Getting started', href: '/' },
      { title: 'Introduction', href: '/docs/tezos-basics/introduction' },
      { title: 'Nodes', href: '/docs/tezos-basics/nodes' },
      { title: 'Liquid Proof of Stake', href: '/docs/tezos-basics/liquid-proof-of-stake' },
      { title: 'Operations', href: '/docs/tezos-basics/operations' },
      { title: 'CLI and RPC', href: '/docs/tezos-basics/cli-and-rpc' },
      { title: 'Governance on-chain', href: '/docs/tezos-basics/governance-on-chain' },
      { title: 'Economics and rewards', href: '/docs/tezos-basics/economics-and-rewards' },
      { title: 'Tezos performances and costs', href: '/docs/tezos-basics/tezos-performances-and-costs' },
      { title: 'Tickets', href: '/docs/tezos-basics/tickets' },
      { title: 'Sapling', href: '/docs/tezos-basics/sapling' },
      { title: 'Testing modes and networks', href: '/docs/tezos-basics/test-networks' },
    ],
  },
  {
    title: 'Smart contracts',
    links: [
      { title: 'First contracts - NFTs', href: '/docs/smart-contracts/simple-nft-contract-1/simple-nft-contract-1' },
      { title: 'Calling and deploying contracts', href: '/docs/smart-contracts/call-and-deploy/call-and-deploy' },
      { title: 'First contracts - first flaws', href: '/docs/smart-contracts/avoiding-flaws/avoiding-flaws' },
      { title: 'Examples of contracts', href: '/docs/smart-contracts/simplified-contracts/simplified-contracts' },
      { title: 'Smart contract concepts', href: '/docs/smart-contracts/smart-contracts-concepts/smart-contracts-concepts' },
      { title: 'Avoiding flaws', href: '/docs/smart-contracts/avoiding-flaws/avoiding-flaws' },
      { title: 'Using and trusting Oracles', href: '/docs/smart-contracts/oracles/oracles' },
    ],
  },
  {
    title: 'Deploy a node',
    links: [
      { title: 'Introduction', href: '/docs/deploy-a-node/introduction/introduction' },
      { title: 'Installation & Setup', href: '/docs/deploy-a-node/installation/installation' },
      { title: 'Monitor a node', href: '/docs/deploy-a-node/monitor-a-node/monitor-a-node' },
      { title: 'What about networks?', href: '/docs/deploy-a-node/networks/networks' },
      { title: 'Best practices', href: '/docs/deploy-a-node/best-practices/best-practices' },
      { title: 'To go further', href: '/docs/deploy-a-node/to-go-further/to-go-further' },
      { title: 'Deploy a cluster of nodes using Pulumi', href: '/docs/deploy-a-node/node-cluster/node-cluster' },
    ],
  },
  {
    title: 'How to use an explorer',
    links: [
      { title: 'Introduction', href: '/docs/explorer/introduction/introduction' },
      { title: 'How indexers work', href: '/docs/explorer/indexer-explained/indexer-explained' },
      { title: 'Available Tezos Explorers', href: '/docs/explorer/available-tezos-indexers/available-tezos-indexers' },
      { title: 'How to use tzStats', href: '/docs/explorer/tzstats-main-features/tzstats-main-features' },
      { title: 'View your contract on tzStats', href: '/docs/explorer/tzstats-smart-contract/tzstats-smart-contract' },
      { title: 'Private indexer', href: '/docs/explorer/private-indexer/private-indexer' },
    ],
  },
  {
    title: 'Michelson',
    links: [
      { title: 'Introduction', href: '/docs/michelson/introduction/introduction' },
      { title: 'Smart Contracts', href: '/docs/michelson/smart-contracts/smart-contracts' },
      { title: 'Tutorial', href: '/docs/michelson/tutorial/tutorial' },
      { title: 'Examples', href: '/docs/michelson/examples/examples' },
      { title: 'Instructions reference', href: '/docs/michelson/instructions-reference/instructions-reference' },
      { title: 'Takeaway', href: '/docs/michelson/take-away/take-away' },
    ],
  },
  {
    title: 'Build a Dapp',
    links: [
      { title: 'Introduction', href: '/docs/dapp/introduction/introduction' },
      { title: 'Taquito', href: '/docs/dapp/taquito/taquito' },
      { title: 'Temple wallet', href: '/docs/dapp/temple-wallet/temple-wallet' },
      { title: 'Deploy', href: '/docs/dapp/deploy/introduction/introduction' },
      { title: 'Frontend (Basics)', href: '/docs/dapp/frontend-basics/frontend-basics' },
      { title: 'Frontend (Advanced)', href: '/docs/dapp/frontend-advanced/frontend-advanced' },
      { title: 'Using indexers', href: '/docs/dapp/indexers/introduction/introduction' },
    ],
  },
  {
    title: 'Baking',
    links: [
      { title: 'Introduction', href: '/docs/baking/introduction/introduction' },
      { title: 'How baking works', href: '/docs/baking/baking_explained/baking_explained' },
      { title: 'Rewards', href: '/docs/baking/reward/reward' },
      { title: 'Risks', href: '/docs/baking/risks/risks' },
      { title: 'Delegating', href: '/docs/baking/delegating/delegating' },
      { title: 'List of bakers', href: '/docs/baking/bakers_list/bakers_list' },
      { title: 'Become a baker', href: '/docs/baking/cli-baker/cli-baker' },
      { title: 'Create a baker\'s concensus key', href: '/docs/baking/consensus-key/consensus-key' },
      { title: 'Run a persistent baking node', href: '/docs/baking/persistent-baker/persistent-baker' },
      { title: 'Submit transactions to a specific baker', href: '/docs/baking/baker-selection/baker-selection' },
      { title: 'Glossary', href: '/docs/baking/glossary/glossary' },
    ],
  },
  {
    title: 'DeFi',
    links: [
      { title: 'Introduction', href: '/docs/defi/introduction/introduction' },
      { title: 'Token standards', href: '/docs/defi/token-standards/token-standards' },
      { title: 'Decentralized exchanges', href: '/docs/defi/dexs/dexs' },
      { title: 'Wrapped assets', href: '/docs/defi/wrapped-assets/wrapped-assets' },
      { title: 'Cross-chain swaps', href: '/docs/defi/cross-chain-swaps/cross-chain-swaps' },
      { title: 'On-chain oracles', href: '/docs/defi/oracles/oracles' },
      { title: 'Stablecoins', href: '/docs/defi/stablecoins/stablecoins' },
      { title: 'Synthetics', href: '/docs/defi/synthetics/synthetics' },
      { title: 'Decentralized autonomous organization', href: '/docs/defi/dao/dao' },
      { title: 'Lending and flash loans', href: '/docs/defi/lending/lending' },
      { title: 'Decentalized Fundraising', href: '/docs/defi/decentralized-fundraising/decentralized-fundraising' },
      { title: 'Rolling SAFE', href: '/docs/defi/rolling-safe/presentation/presentation' } ,
    ],
  },
  {
    title: 'Gaming Unity-SDK',
    links: [
      { title: 'Introduction', href: '/docs/gaming/unity-sdk/introduction/introduction' },
      { title: 'Getting started', href: '/docs/gaming/unity-sdk/getting-started/getting-started' },
      { title: 'API documentation', href: '/docs/gaming/unity-sdk/api-documentation/api-documentation' },
      { title: 'Inventory sample game', href: '/docs/gaming/unity-sdk/inventory-sample-game/inventory-sample-game' },
      { title: 'Other use cases', href: '/docs/gaming/unity-sdk/other-use-cases/other-use-cases' },
    ],
  },
  {
    title: 'Self sovereign identity',
    links: [
      { title: 'Introduction', href: '/docs/self-sovereign-identity/introduction/introduction' },
      { title: 'Issues surrounding decentralized identity', href: '/docs/self-sovereign-identity/challenges/challenges' },
      { title: 'Development of the notion of identity', href: '/docs/self-sovereign-identity/development/development' },
      { title: 'Decentralized identifiers', href: '/docs/self-sovereign-identity/did/did' },
      { title: 'Decentralized identity platforms', href: '/docs/self-sovereign-identity/did-platforms/did-platforms' },
      { title: 'Tezos and decentralized identity', href: '/docs/self-sovereign-identity/tezos-did/tezos-did' },
      { title: 'Sources & bibliography', href: '/docs/self-sovereign-identity/sources/sources' },
    ],
  },
  {
    title: 'Formal Verification',
    links: [
      { title: 'Introduction', href: '/docs/formal-verification/introduction/introduction' },
      { title: 'Generalities', href: '/docs/formal-verification/general/general' },
      { title: 'Mi-Cho-Coq', href: '/docs/formal-verification/michocoq/michocoq' },
      { title: 'Formal verification on smart contracts', href: '/docs/formal-verification/modeling-theorem/modeling-theorem' },
    ],
  },
  {
    title: 'Private Blockchain',
    links: [
      { title: 'Introduction', href: '/docs/private/introduction/introduction' },
      { title: 'Installation', href: '/docs/private/installation/installation' },
      { title: 'Genesis block & bootstrap bakers', href: '/docs/private/genesis/genesis' },
      { title: 'Starting the blockchain', href: '/docs/private/starting-blockchain/starting-blockchain' },
      { title: 'Using the blockchain', href: '/docs/private/using-blockchain/using-blockchain' },
      { title: 'VPN configuration', href: '/docs/private/vpn/vpn' },
    ],
  },
  {
    title: 'How to contribute',
    links: [
      { title: 'Introduction', href: '/docs/contribute/introduction/introduction' },
      { title: 'Report an issue', href: '/docs/contribute/report-issue/report-issue' },
      { title: 'Contribute to OpenTezos', href: '/docs/contribute/opentezos/opentezos' },
      { title: 'Contribute to Tezos Core Protocol', href: '/docs/contribute/tezos-core/tezos-core' },
      { title: 'Receive a grant', href: '/docs/contribute/grant/grant' },
      { title: 'Become a baker or delegator', href: '/docs/contribute/baker/baker' },
    ],
  },
  {
    title: 'Protocol in depth',
    links: [
      { title: 'Overview', href: '/docs/economic-protocol/protocol-overview' },
      { title: 'Proof of Stake', href: '/docs/economic-protocol/proof-of-stake' },
      { title: 'Randomness generation', href: '/docs/economic-protocol/randomness-generation' },
      { title: 'The consensus algorithm', href: '/docs/economic-protocol/consensus' },
      { title: 'Amendment and voting process', href: '/docs/economic-protocol/voting' },
      { title: 'Michelson', href: '/docs/economic-protocol/michelson' },
      { title: 'Time-lock', href: '/docs/economic-protocol/timelock' },
      { title: 'Sapling integration', href: '/docs/economic-protocol/sapling' },
      { title: 'Liquidity baking', href: '/docs/economic-protocol/liquidity-baking' },
      { title: 'Global constants', href: '/docs/economic-protocol/global-constants' },
      { title: 'Token transfers and balance updates', href: '/docs/economic-protocol/token-management' },
      { title: 'Prechecking of manager operations', href: '/docs/economic-protocol/precheck' },
      { title: 'Smart optimistic rollups', href: '/docs/economic-protocol/smart-rollups' },
      { title: 'Protocol plugins', href: '/docs/economic-protocol/plugins' },
      { title: 'Contract events', href: '/docs/economic-protocol/event' },
      { title: 'Blocks and operations', href: '/docs/economic-protocol/blocks-ops' },
      { title: 'Validation and application', href: '/docs/economic-protocol/validation' },
      { title: 'Tickets', href: '/docs/economic-protocol/tickets' },
    ],
  },
  {
    title: 'Developer',
    links: [
      { title: 'Encodings', href: '/docs/developer/encodings/encodings' },
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
        'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-white px-4 py-5 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-none sm:px-6 lg:px-8',
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
          <h1 className="hidden h-8 w-auto fill-slate-700 dark:fill-sky-100 lg:inline-flex text-blue-600 text-xl" >
          Tezos Docs
          </h1>
        </Link>
      </div>
      <div className="-my-5 mr-6 sm:mr-8 md:mr-0">
        <Search />
      </div>
      <div className="relative flex basis-0 justify-end gap-6 sm:gap-8 md:flex-grow">
        <ThemeSelector className="relative z-10" />
        <Link href="https://github.com/trilitech/docs-staging" className="group" aria-label="GitHub">
          <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
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
              <header className="mb-9 space-y-1">
                {section && (
                  <p className="font-display text-sm font-medium text-blue-600">
                    {section.title}
                  </p>
                )}
                {title && (
                  <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
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
    </>
  )
}
