type severity = 'error' | 'warning' | 'info' | 'success';
type snackbarState = {
  snackbarOpen?: boolean;
  severity: severity;
  message: string;
  autoClose?: boolean;
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
};
export type { severity, snackbarState };
