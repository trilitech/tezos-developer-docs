import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function TutorialCard({ title, href, description, link, emoji }) {
  return (
    <div className={clsx(styles.tutorialcard)}>
      <div>
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
