import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './Input.module.css';

type CustomInputPropsBase = {
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
};

type CustomInputHTMLProps = {
  isTextarea?: false;
} & InputHTMLAttributes<HTMLInputElement>;

type CustomTextAreaHTMLProps = {
  isTextarea: true;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

type CustomInputProps = CustomInputPropsBase &
  (CustomInputHTMLProps | CustomTextAreaHTMLProps);

function Input({
  label,
  required = false,
  disabled = false,
  isTextarea = false,
  type,
  ...rest
}: CustomInputProps) {
  // we have to tell expicitly ts that this is a textarea element
  let InputElement = isTextarea ? ('textarea' as React.ElementType) : 'input';

  return (
    <div
      className={`${styles.container} ${
        type === 'checkbox' ? styles.container_checkbox : ''
      }`}
    >
      {label && <label htmlFor={label}>{label}</label>}
      <InputElement
        id={label}
        {...rest}
        type={type}
        required={required}
        disabled={disabled}
        aria-labelledby={label && label}
        aria-required={required}
        aria-disabled={disabled}
      />
    </div>
  );
}

export default Input;
