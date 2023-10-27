import { Callout } from '@/components/Callout'
import { LgLink, LgLinks } from '@/components/LgLinks'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'

import Math from '@/components/Math'
import CalendlyEmbed from '@/components/CalendlyEmbed';
// import Tab from '@/components/Tab'
// import Tabs from '@/components/Tabs'
// import { Tag } from '@markdoc/markdoc';

// Import the built-in Next.js tags
import { comment } from '@markdoc/next.js/tags'

// Custom tag to allow embedding HTML elements
const UnescapedHtml = ({ htmlWrapperTag = 'div', children }) => {
  const html =
    typeof children === 'string'
      ? children
      : typeof children.props.children === 'string'
      ? children.props.children
      : children.props.children.join('')

  const CustomTag = htmlWrapperTag
  return <CustomTag dangerouslySetInnerHTML={{ __html: html }} />
}

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
      isTutorial: { type: Boolean, default: false },
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
      isTutorial: { type: Boolean, default: false },
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
  calendlyEmbed: {
    render: CalendlyEmbed,
  },
  html: {
    render: UnescapedHtml,
    attributes: {
      htmlWrapperTag: { type: String },
      children: { type: String },
    },
  },
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

