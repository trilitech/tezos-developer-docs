import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './styles.module.css';

// Mocked version of SyntaxTitle component from LIGO repo

function SyntaxTitle(props) {
  return (
  <>
    <div className={clsx(styles.titleText)}>{props.syntax}</div>
    <CodeBlock>{props.children}</CodeBlock>
  </>);
}

export default SyntaxTitle
