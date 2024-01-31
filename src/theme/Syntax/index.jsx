import clsx from 'clsx';
import styles from './styles.module.css';

// Mocked version of Syntax component from LIGO repo

function Syntax(props) {
  return (
  <>
    <div className={clsx(styles.titleText)}>{props.syntax}</div>
    {props.children}
  </>);
}

export default Syntax
