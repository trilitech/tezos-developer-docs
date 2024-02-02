import React from 'react';
import DocSidebar from '@theme-original/DocSidebar';
import SyntaxSwitch from '../SyntaxSwitch';
import { useSyntax } from "../SyntaxContext";
import clsx from 'clsx';
import styles from './styles.module.css';

export default function DocSidebarWrapper(props) {
  const { path } = props;
  const { syntax, setSyntax } = useSyntax();

  const ligoSwitcher = path.startsWith('/languages/ligo') ?
    <SyntaxSwitch syntax={syntax} onSyntaxChange={setSyntax} />
    : <></>;

  const sidebarContainerClass = path.startsWith('/languages/ligo') ?
    clsx(styles.docsidebar__container) : null;

  return (
    <>
      {ligoSwitcher}
      <div className={sidebarContainerClass} >
        <DocSidebar {...props}/>
      </div>
    </>
  );
}
