import { Callout } from '@/components/Callout'
import { LgLink, LgLinks } from '@/components/LgLinks'
import { QuickLink, QuickLinks } from '@/components/QuickLinks'

import Math from '../src/components/Math'
import Code from '../src/components/Code'

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
  code: {
    render: 'Code',
    children: ['text'],
    attributes: {
      language: {
        type: String,
        default: 'javascript',
        errorLevel: 'critical',
      },
    },
    render: Code,
  },
}

export default tags
