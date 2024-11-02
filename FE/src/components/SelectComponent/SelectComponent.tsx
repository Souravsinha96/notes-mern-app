import { useEffect, useRef, useState } from 'react';
import styles from './SelectComponent.module.css';

export type SelectOption = Record<string, any>;
type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};
type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);
function SelectComponent({ multiple, value, onChange, options }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value?.map((item: SelectOption) => item.id).includes(option.id)) {
        onChange(value.filter((o) => o !== option));
      } else {
        onChange([...value, option]);
      }
      containerRef?.current?.focus();
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple
      ? value?.map((item: SelectOption) => item.id).includes(option.id)
      : option === value;
  }

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const containerReference = containerRef?.current;
    const handler = (e: KeyboardEvent) => {
      if (e.target != containerRef.current) return;
      switch (e.code) {
        case 'Enter':
        case 'Space':
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlightedIndex]);
          break;
        case 'ArrowUp':
        case 'ArrowDown': {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlightedIndex + (e.code === 'ArrowDown' ? 1 : -1);
          if (newValue >= 0 && newValue < options.length) {
            setHighlightedIndex(newValue);
          }
          break;
        }
        case 'Escape':
          setIsOpen(false);
      }
    };
    containerReference?.addEventListener('keydown', handler);
    return () => {
      containerReference?.removeEventListener('keydown', handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      className={styles.container}
      tabIndex={0}
      role="combobox"
      aria-expanded={isOpen}
      aria-controls="combobox"
    >
      <span className={styles.value} data-testid="selectedItem">
        {multiple
          ? value.map((option, index) => (
              <button
                key={`${option.id}-${index}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectOption(option);
                }}
                className={styles['option-badge']}
              >
                {option.label}
                {
                  <span
                    aria-label={`clear badge-${option.id}`}
                    className={styles['remove-btn']}
                  >
                    &times;
                  </span>
                }
              </button>
            ))
          : value?.label}
      </span>
      {
        <button
          aria-label="clear button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            clearOptions();
          }}
          className={styles['clear-btn']}
        >
          &times;
        </button>
      }
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
        {options.map((option, index) => (
          <li
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ''
            } ${index === highlightedIndex ? styles.highlighted : ''}`}
            key={`${option.id}-${index}`}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default SelectComponent;
