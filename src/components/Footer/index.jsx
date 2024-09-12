import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import { ChatBob } from '@site/src/components/ChatBob'

const socialLinks = [
  { name: 'Discord', link: 'https://discord.gg/tezos-blockchain-699325006928281720', icon: '/img/socials/Tezos-social-icon-white-01.svg' },
  { name: 'Telegram', link: 'https://t.me/tezosplatform', icon: '/img/socials/Tezos-social-icon-white-02.svg' },
  { name: 'TezosAgora', link: 'https://forum.tezosagora.org/', icon: '/img/socials/Tezos-social-icon-white-03.svg' },
  { name: 'Github', link: 'https://github.com/tezos/tezos', icon: '/img/socials/Tezos-social-icon-white-04.svg' },
  { name: 'Twitter', link: 'https://twitter.com/tezos', icon: '/img/socials/Tezos-social-icon-white-05.svg' },
  { name: 'Riot', link: 'https://riot.tzchat.org/', icon: '/img/socials/Tezos-social-icon-white-06.svg' },
  { name: 'Gitlabs', link: 'https://gitlab.com/tezos/tezos', icon: '/img/socials/Tezos-social-icon-white-07.svg' },
  { name: 'StackExchange', link: 'https://tezos.stackexchange.com/', icon: '/img/socials/Tezos-social-icon-white-08.svg' },
  { name: 'Reddit', link: 'https://www.reddit.com/r/tezos', icon: '/img/socials/Tezos-social-icon-white-09.svg' },
];

const navLinks = [
  { label: 'Tezos Stack Exchange', to: 'https://tezos.stackexchange.com/' },
  { label: 'Tezos Agora', to: 'https://forum.tezosagora.org/' },
  { label: 'Tezos Baking Slack', to: 'https://tezos.com/governance/' },
  { label: 'Developer Support', to: 'https://tezos.com/developers/' },
  { label: 'Events Calendar', to: 'https://tezos.com/community/' },
  { label: 'Developer Survey', to: 'https://tezos.com/developers/' },
];

const navLinks2 = [
  { label: 'White Paper', to: 'https://tezos.com/whitepaper.pdf' },
  { label: 'Smart Rollups', to: 'https://tezos.com/developers/smart-rollups/' },
  { label: 'Smart Contract', to: 'https://tezos.com/developers/languages/' },
  { label: 'Build a dApp', to: 'https://tezos.com/developers/resources/' },
  { label: 'Languages', to: 'https://tezos.com/developers/#discover' },
  { label: 'GitHub', to: 'https://github.com/tezos/tezos' },
];

const additionalLinks = [
  { label: 'Tezos.com', to: 'https://tezos.com/' },
  { label: 'Privacy Policy', to: 'https://tezos.com/privacy-notice/' },
];

export default function Footer() {
  return (
    <footer>
      <div className={clsx(styles.container)}>
        <div className={clsx(styles.footerColumns)}>
          <div className={clsx(styles.footerColumn)}>
            <a href="/" className={clsx(styles.logoContainer)}>
              <img src="/img/logo-tezos.svg" alt="Tezos" />
              <p className={clsx(styles.logoText)}>Tezos Docs</p>
            </a>

            <h5 className={clsx(styles.follow)}>FOLLOW US</h5>
            {socialLinks.map((social, index) => (
              <a key={index} href={social.link} className={clsx(styles.socialLink)} target="_blank" rel="noopener noreferrer">
                <img src={social.icon} alt={social.name} />
              </a>
            ))}
            <p className={clsx(styles.contact)}><span className={clsx(styles.contactBold)}>Feedback or comments?</span> Get in touch with us at  <a href="mailto:reachout@tezos.com" target="_blank" rel="noopener noreferrer" className={clsx(styles.emailLink)}>
              reachout@tezos.com
            </a></p>
          </div>
          <div className={clsx(styles.footerColumn)}>
            <p className={clsx(styles.subtitle)}>COMMUNITY</p>
            <ul className={styles.footerLinks}>
              {navLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.to}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className={clsx(styles.footerColumn2)}>
            <p className={clsx(styles.subtitle)}>TECHNOLOGY</p>
            <ul className={styles.footerLinks}>
              {navLinks2.map((link, index) => (
                <li key={index}>
                  <a href={link.to}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={clsx(styles.footerSeparator)}></div>
        <div className={clsx(styles.footerLinksContainer)}>
          <div className={clsx(styles.footerLeftLinks)}>
            <span className={clsx(styles.footerCopyright)}>© 2023-{new Date().getFullYear()} TriliTech<span className={clsx(styles.footerCopyrightLine)}> | </span>Built with Docusaurus</span>
          </div>
          <div className={clsx(styles.footerRightLinks)}>
            <ul className={clsx(styles.footerLinks)}>
              {additionalLinks.map((link, index) => (
                <li key={index} className={clsx(styles.additionalLink)}>
                  <a href={link.to}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ChatBob />
    </footer>
  );
}