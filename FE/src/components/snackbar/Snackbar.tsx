import { useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../core/hooks';
import { selectSnackbar, closeSnackbar } from '../../core/slices/snackbarSlice';
import { severity } from './snackbarTypes';

import styles from './Snackbar.module.css';

const StyledSnackbar = () => {
  const snackbarRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();

  const { snackbarOpen, severity, message, autoClose, position } =
    useAppSelector(selectSnackbar);

  const getBackgroundColor = (severity: severity) => {
    switch (severity) {
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#f57c00';
      case 'info':
        return '#1976d2';
      case 'success':
        return '#43a047';
      default:
        return '#333'; // Default color
    }
  };
  const handleClose = () => {
    dispatch(closeSnackbar());
  };

  const getTopPosition = () => {
    return position?.vertical === 'top' ? '24px' : 'auto';
  };
  const getBottomPosition = () => {
    return position?.vertical === 'bottom' ? '24px' : 'auto';
  };
  const getRightPosition = () => {
    if (position?.horizontal === 'right') {
      return '24px';
    } else if (position?.horizontal === 'center') {
      return 'calc(50% - 150px)'; // Assuming Snackbar width is 300px
    } else {
      return 'auto';
    }
  };
  const getLeftPosition = () => {
    return position?.horizontal === 'left' ? '24px' : 'auto';
  };

  useEffect(() => {
    if (snackbarOpen) {
      // Focus the close button when Snackbar opens
      // If Snackbar should auto-close, set a timeout to close it
      if (autoClose) {
        const timeoutId = setTimeout(() => {
          dispatch(closeSnackbar());
        }, 3000);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [snackbarOpen, autoClose, dispatch]);

  useEffect(() => {
    if (snackbarOpen) {
      closeBtnRef.current?.focus();
    }
  }, [snackbarOpen]);

  return (
    <div
      ref={snackbarRef}
      className={`${styles.snackbar} ${snackbarOpen ? styles.open : ''}`}
      style={{
        top: getTopPosition(),
        bottom: getBottomPosition(),
        right: getRightPosition(),
        left: getLeftPosition(),
        backgroundColor: getBackgroundColor(severity),
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="message">{message}</div>
      <button
        ref={closeBtnRef}
        className={styles.close_btn}
        onClick={handleClose}
        aria-label="Close"
        data-testid="close_btn"
      >
        &times;
      </button>
    </div>
  );
};

export default StyledSnackbar;
