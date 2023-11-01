import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const cardData = [
  {
    emoji: '🤗',
    title: 'Developer-friendly experience',
    description: 'Tezos supports multiple high-level languages, including variants of JavaScript/TypeScript, Python, and OCaml. The Tezos community provides local testing tools and ways to verify that your code does what you intend it to do.',
  },
  {
    emoji: '🔋',
    title: 'Proof of stake',
    description: 'The proof-of-stake consensus model eliminates the need for high energy use, making it the "green" choice for blockchains. Instead of competing to achieve consensus as in proof-of-work models, Tezos nodes (called bakers) stake Tezos tokens to earn the right to create blocks and receive rewards.',
  },
  {
    emoji: '✨',
    title: 'Support for many digital asset types',
    description: 'Tezos allows you to create a variety of digital assets, whether those assets are unique (as in non-fungible tokens, or NFTs), part of a limited group, or divisible like cryptocurrencies. You write the code that controls how your assets behave, such as what happens when a user transfers an asset to another user.',
  },
  {
    emoji: '🤝',
    title: 'Stakeholder-led governance',
    description: "Anyone who holds XTZ — the chain's native token — can propose changes to how Tezos works, such as changes to gas fees and block times, new features such as smart rollups, or even major changes like how the consensus mechanism works."
  },
  {
    emoji: '🛠️',
    title: 'Upgradeable platform',
    description: 'Tezos has a built-in capability to upgrade itself, which allows the network to evolve without requiring a hard fork. This feature allows Tezos to adapt to new technologies and to address user needs rapidly.',
  },
  {
    emoji: '💫',
    title: 'Formal verification',
    description: 'Formal verification is a process that ensures that code on Tezos does what it says it does and has no side effects. Formal verification reduces errors, bugs, and security vulnerabilities in smart contracts and allows users to trust them.',
  },
];

function MasonryLayout({ isMobile, currentIndex, goToSlide, handleTouchStart, handleTouchMove, handleTouchEnd, containerRef }) {
  if (isMobile) {
    return (
      <>
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={clsx(styles.masonryContainerMobile)} ref={containerRef}>
            {cardData.map((card, index) => (
              <div
                key={index}
                style={{ display: index === currentIndex ? 'block' : 'none' }}
              >
                <div className={clsx(styles.card)}>
                  <p>{card.emoji}</p>
                  <h2 className={clsx(styles.cardTitle)}>{card.title}</h2>
                  <p className={clsx(styles.cardDescription)}>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {cardData.map((_, idx) => (
            <button
              key={idx}
              className={`${styles.featureButton} ${idx === currentIndex ? styles.selected : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <div className={clsx(styles.masonryContainer)}>
      {cardData.map((card, index) => (
        <div className={clsx(styles.card)} key={index}>
          <p>{card.emoji}</p>
          <h2 className={clsx(styles.cardTitle)}>{card.title}</h2>
          <p className={clsx(styles.cardDescription)}>{card.description}</p>
        </div>
      ))}
    </div>
  );
}


export default function BuildSection() {
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
      const numOfSlides = cardData.length;
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
    <div className={clsx(styles.buildSection)}>
      <div className={clsx(styles.container)}>
        <p className={clsx(styles.mainTitle)}>WHY BUILD ON TEZOS?</p>
        {isMobile ? (
          <h1 className={clsx(styles.cardHeading)}>
            Developers are driven to Tezos for its <span className={clsx(styles.cardHeadingBlue)}>pioneering tools and platforms</span>
          </h1>
        ) : (
          <>
            <h1 className={clsx(styles.cardHeading)}>
              Developers are driven to Tezos for its
            </h1>
            <h1 className={clsx(styles.cardHeadingBlue)}>
              pioneering tools and platforms
            </h1>
          </>
        )}
        <MasonryLayout
          isMobile={isMobile}
          currentIndex={currentIndex}
          goToSlide={goToSlide}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          containerRef={containerRef}
        />
      </div>
    </div>
  );
}

