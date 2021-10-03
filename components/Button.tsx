import { DetailedHTMLProps, ButtonHTMLAttributes, createElement } from 'react';
import classNames from 'classnames';
// @ts-ignore
import * as styles from '../styles/Button.module.scss';

/**
 * Button component
 */
export interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  ariaLabel?: string;
  as?: 'button' | 'a';
  target?: string;
  href?: string;
  rel?: string;
  style?: React.CSSProperties;
  color?: 'transparent' | 'black' | 'gray' | 'light-gray' | 'peach' | 'white';
  size?: 'small';
  title?: string;
}

const Button = ({
  as,
  onClick,
  type,
  href,
  target,
  rel,
  className,
  ariaLabel,
  disabled,
  children,
  color,
  style,
  size,
  title,
}: ButtonProps): JSX.Element => {
  const buttonClasses = [
    // @ts-ignore
    styles.button,
    color && styles[`button--${color}`],
    size && styles[`button--${size}`],
    className && className
  ];
  return createElement(
    as,
    {
      onClick: onClick,
      type: type,
      href: href,
      target: target,
      rel: rel,
      style: style,
      title: title,
      className: classNames(buttonClasses),
      'aria-label': ariaLabel,
      disabled: disabled,
    },
    children
  );
};

Button.defaultProps = {
  as: 'button',
  target: '_blank',
  rel: 'noopener noreferrer',
  type: 'button',
  disabled: false,
};

export default Button;
