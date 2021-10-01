import classNames from 'classnames';

import styles from './Button.module.sass';

export const TYPES = {
  MAIN: styles.main,
  DANGER: styles.danger,
};

export const SIZES = {
  SM: styles.small
};

const Button = (
  {
    className = '',
    type = TYPES.MAIN,
    size,
    children,
    onClick = () => {
    },
  }
) => (
  <button
    type="button"
    className={classNames(className, type, size, styles.button)}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
