import React from 'react'
import clsx from 'clsx';
import styles from './styles.module.css';

export default function TutorialCardContainer(props) {
  return (
    <div className={clsx(styles.tutorialcardcontainer)}>{props.children}</div>
  )
}