import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import CalendlyEmbed from '@site/src/components/CalendlyEmbed.jsx';
import styles from './index.module.css';
import BuildSection from '@site/src/components/BuildSection';
import Footer from '@site/src/components/Footer';


function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner, styles.customHeader)}>
      <div className={clsx(styles.container)}>
        <h1 className={clsx(styles.hero__title)}>{siteConfig.title}</h1>
        <p className={clsx(styles.hero__subtitle)}>{siteConfig.tagline}</p>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome`}
      description="Developer Documentation for developers building on Tezos <head />">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        {/* <div className={clsx(styles.text__booking)}>
          <h1 className={clsx(styles.homeTitle)}>We are here <span className={clsx(styles.homeTitleBlue)}>for you</span></h1>
          <p className={clsx(styles.homeContent)}>Book a 15 min, 1 to 1 session hosted by the Tezos Developer Success team to discuss and answer your technical questions.</p>
        </div> */}
        {/* <CalendlyEmbed /> */}
        <BuildSection />
      </main>
      <Footer />
    </Layout>
  );
}
