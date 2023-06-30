import { Callout } from '@/components/Callout'
import { LgLink, LgLinks } from '@/components/LgLinks'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'

import Math from '@/components/Math'
// import Tab from '@/components/Tab'
// import Tabs from '@/components/Tabs'
// import { Tag } from '@markdoc/markdoc';

// Import the built-in Next.js tags
import { comment } from '@markdoc/next.js/tags'

const tags = {
  callout: {
    attributes: {
      title: { type: String },
      type: {
        type: String,
        default: 'note',
        matches: ['note', 'warning'],
        errorLevel: 'critical',
      },
    },
    render: Callout,
  },
  figure: {
    selfClosing: true,
    attributes: {
      src: { type: String },
      alt: { type: String },
      caption: { type: String },
    },
    render: ({ src, alt = '', caption }) => (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        <figcaption>{caption}</figcaption>
      </figure>
    ),
  },
  'quick-links': {
    render: QuickLinks,
  },
  'quick-link': {
    selfClosing: true,
    render: QuickLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
      comingSoon: { type: Boolean, default: false },
    },
  },
  'lg-links': {
    render: LgLinks,
  },
  'lg-link': {
    selfClosing: true,
    render: LgLink,
    attributes: {
      title: { type: String },
      description: { type: String },
      icon: { type: String },
      href: { type: String },
    },
  },
  math: {
    render: Math,
    children: ['text'],
    attributes: {
      inline: {
        type: Boolean,
        default: false,
      },
    },
  },
  comment,
  // tabs: {
  //   render: Tabs,
  //   attributes: {},
  //   transform(node, config) {
  //     const labels = node
  //       .transformChildren(config)
  //       .filter((child) => child && child.name === 'Tab')
  //       .map((tab) => (typeof tab === 'object' ? tab.attributes.label : null))

  //     return new Tag(this.render, { labels }, node.transformChildren(config))
  //   },
  // },
  // tab: {
  //   render: Tab,
  //   attributes: {
  //     label: {
  //       type: String
  //     }
  //   }
  // },
}

export default tags

