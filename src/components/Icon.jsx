/* eslint-disable react/prop-types,import/no-unresolved */
import React from 'react'
// import { useId } from 'react'
import clsx from 'clsx'

import { InstallationIcon } from '@site/src/components/icons/InstallationIcon'
import { LightbulbIcon } from '@site/src/components/icons/LightbulbIcon'
import { PluginsIcon } from '@site/src/components/icons/PluginsIcon'
import { PresetsIcon } from '@site/src/components/icons/PresetsIcon'
import { ThemingIcon } from '@site/src/components/icons/ThemingIcon'
import { WarningIcon } from '@site/src/components/icons/WarningIcon'
import { OverviewIcon } from '@site/src/components/icons/OverviewIcon'
import { QuickstartIcon } from '@site/src/components/icons/QuickstartIcon'
import { DeployIcon } from '@site/src/components/icons/DeployIcon'
import { ProtocolIcon } from '@site/src/components/icons/ProtocolIcon'
import { TestIcon } from '@site/src/components/icons/TestIcon'
import { ContractIcon } from '@site/src/components/icons/ContractIcon'
import { TokenIcon } from '@site/src/components/icons/TokenIcon'
import { NftIcon } from '@site/src/components/icons/NftIcon'
import { MarketplaceIcon } from '@site/src/components/icons/MarketplaceIcon'
import { UnityIcon } from '@site/src/components/icons/UnityIcon'
import { GameIcon } from '@site/src/components/icons/GameIcon'
import { DappIcon } from '@site/src/components/icons/DappIcon'
import { TaquitoIcon } from '@site/src/components/icons/TaquitoIcon'
import { IndexerIcon } from '@site/src/components/icons/IndexerIcon'
import { WalletIcon } from '@site/src/components/icons/WalletIcon'
import { FrameworkIcon } from '@site/src/components/icons/FrameworkIcon'


const icons = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
  overview: OverviewIcon,
  quickstart: QuickstartIcon,
  deploy: DeployIcon,
  protocol: ProtocolIcon,
  test: TestIcon,
  contract: ContractIcon,
  token: TokenIcon,
  nft: NftIcon,
  marketplace: MarketplaceIcon,
  unity: UnityIcon,
  game: GameIcon,
  app: DappIcon,
  taquito: TaquitoIcon,
  indexer: IndexerIcon,
  wallet: WalletIcon,
  framework: FrameworkIcon,
}

const iconStyles = {
  blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
  amber:
    '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]',
}

export function Icon({ color = 'blue', icon, className, ...props }) {
  // let id = useId()
  let IconComponent = icons[icon]

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 32 32"
      fill="none"
      className={clsx(className, iconStyles[color])}
      {...props}
    >
      <IconComponent color={color} />
    </svg>
  )
}

const gradients = {
  blue: [
    { stopColor: '#408DFF' },
    { stopColor: '#7CB3FF', offset: '.527' },
    { stopColor: '#BEDFFF', offset: 1 },
  ],
  amber: [
    { stopColor: '#FDE68A', offset: '.08' },
    { stopColor: '#F59E0B', offset: '.837' },
  ],
}

export function Gradient({ color = 'blue', ...props }) {
  return (
    <radialGradient
      cx={0}
      cy={0}
      r={1}
      gradientUnits="userSpaceOnUse"
      {...props}
    >
      {gradients[color].map((stop, stopIndex) => (
        <stop key={stopIndex} {...stop} />
      ))}
    </radialGradient>
  )
}

export function LightMode({ className, ...props }) {
  return <g className={clsx('dark:hidden', className)} {...props} />
}

export function DarkMode({ className, ...props }) {
  return <g className={clsx('hidden dark:inline', className)} {...props} />
}
