import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    emoji: '💡',
    title: 'Tezos overview',
    href: 'docs/overview',
    description: (
      <>
        Read about how Tezos works, what distinguishes it from other blockchains, what developers use it for, and how it hosts decentralized applications that run independently of any authority.
      </>
    ),
    link: 'Start learning'
  },
  {
    emoji: '📚',
    title: 'Tutorials',
    href: 'docs/tutorials',
    description: (
      <>
        Work through tutorials that cover coding smart contracts and applications that use those smart contracts, from simple to complex, in multiple languages.
      </>
    ),
    link: 'View tutorials'
  },
  {
    emoji: '🧑‍💻️',
    title: 'Development environments',
    href: 'docs/developing/dev-environments',
    description: (
      <>
        Set up a development environment for your language of choice and its related tools. Use a local environment with a sandbox or a web-based IDE for development work.
      </>
    ),
    link: 'Start developing'
  },

];

function Feature({ title, href, description, link, emoji }) {
  return (
    <div className={clsx(styles.feature)}>
      <div className="text-title">
        <p className={clsx(styles.emoji)}>{emoji}</p>
        <h3 className={clsx(styles.title)}>{title}</h3>
        <p className={clsx(styles.description)}>{description}</p>
        <a href={href} className={clsx(styles.link)}>
          <p style={{ margin: 0 }}>{link}</p>
        </a>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  let startX = 0;
  let isDragging = false;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
    isDragging = true;
  };

  const handleTouchMove = (event) => {
    if (isDragging) {
      const currentX = event.touches[0].clientX;
      const difference = startX - currentX;
      const containerWidth = containerRef.current.offsetWidth;
      const numOfSlides = FeatureList.length;
      const slideWidth = containerWidth / numOfSlides;

      if (difference > 0 && currentIndex < numOfSlides - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (difference < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section>
      {isMobile ? (
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.container} ref={containerRef}>
            {FeatureList.map((props, idx) => (
              <div
                className={styles.features}
                style={{ display: idx === currentIndex ? 'block' : 'none' }}
                key={idx}
              >
                <div className={styles.container}>
                  <div key={idx}>
                    <Feature {...props} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.features}>
          <div className={styles.container}>
            <div className="row" style={{ justifyContent: "center" }}>
              {FeatureList.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className={styles.buttonContainer}>
          {FeatureList.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.featureButton} ${idx === currentIndex ? styles.selected : ''}`}
              onClick={() => goToSlide(idx)} />
          ))}
        </div>
      )}
    </section>
  );
}

