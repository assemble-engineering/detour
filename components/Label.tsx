import classNames from 'classnames';
import { ReactNode } from 'react';

export type LabelProps = {
  // Links the label to the input for a11y
  htmlFor: string;
  // renders the label content
  children: ReactNode;
  // Adds classes to the default label class
  className?: string;
  // Determines if label should be hidden by accessibilty
  ariaHidden: boolean;
};

const Label = ({
  className,
  htmlFor,
  children,
  ariaHidden,
}: LabelProps): JSX.Element => (
  <label
    aria-hidden={ariaHidden}
    id={`${htmlFor}_label`}
    className={classNames([className && className])}
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

export default Label;
