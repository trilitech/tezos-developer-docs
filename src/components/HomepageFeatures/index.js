import React, { useRef, useState, useEffect } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const FeatureList = [
  {
    emoji: '🧑‍💻️',
    title: 'Tezos for end users',
    href: 'using',
    description: (
      <>
        Learn how to set up a Tezos account and manage it with a wallet, stake tez, and use applications.
      </>
    ),
    link: 'Start using Tezos'
  },
  {
    emoji: '💡',
    title: 'Tezos for developers',
    href: 'overview',
    description: (
      <>
        Read about how Tezos works, what distinguishes it from other blockchains, and how to develop decentralized applications.
      </>
    ),
    link: 'Start building'
  },
  {
    emoji: '🍞',
    title: 'Tezos for bakers',
    href: 'architecture/bakers',
    description: (
      <>
        Read how to participate in Tezos and how to set up a full-fledged Octez node for baking.
      </>
    ),
    link: 'Start baking'
  },
  {
    emoji: '📚',
    title: 'Tutorials',
    href: 'tutorials',
    description: (
      <>
        Work through tutorials from simple to complex, that cover using Tezos, baking, and coding smart contracts and applications in multiple languages.
      </>
    ),
    link: 'View tutorials'
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
