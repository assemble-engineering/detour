import {
  ChangeEvent,
  MouseEvent,
  SetStateAction,
  FocusEvent,
  ReactNode,
  DetailedHTMLProps,
  InputHTMLAttributes,
} from 'react';
import classNames from 'classnames';
import Label from './Label';

export type TextInputProps = {
  // type for textinput
  type?: string;
  // unique id for textinput
  id: string;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  // text on displayed label
  labelText: string;
  // placeholder message
  placeholder?: string;
  // required field
  required?: boolean;
  // disable or enable textinput
  disabled?: boolean;
  // optional class styling override of default textinput
  className?: string;
  // optional class styling override of input
  inputClassName?: string;
  // optional class styling override of label
  labelClassName?: string;
  // listener for onChange of textinput
  onChange?: (
    value: string
  ) => void;
  // Adds side effect handler for clicking on an input
  onClick?: (event: MouseEvent) => void;
  onBlur?: (
    event: FocusEvent<HTMLInputElement> | SetStateAction<boolean>
  ) => void;
  onFocus?: (
    event: FocusEvent<HTMLInputElement> | SetStateAction<boolean>
  ) => void;
  autoFocus?: boolean;
  children?: ReactNode;
  value?: string;
};

const TextInput = ({
  placeholder = '',
  id,
  value,
  inputProps = {},
  className,
  inputClassName,
  labelClassName,
  required = false,
  disabled = false,
  onChange,
  onClick,
  onFocus,
  onBlur,
  labelText,
  type,
  autoFocus,
  children,
}: TextInputProps): JSX.Element => {
  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
    return null;
  };

  return (
    <div className={classNames([className && className])}>
      <Label
        className={classNames([labelClassName && labelClassName])}
        ariaHidden={true}
        htmlFor={id}
      >
        {labelText}
      </Label>
      <input
        className={classNames([inputClassName && inputClassName])}
        id={id}
        aria-labelledby={`${id}_label`}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        onChange={handleOnChange}
        onClick={onClick}
        type={type}
        onFocus={onFocus}
        onBlur={onBlur}
        // eslint-disable-next-line
        autoFocus={autoFocus}
        {...inputProps}
      />
      {children && children}
    </div>
  );
};

TextInput.defaultProps = {
  type: 'text',
};

export default TextInput;
