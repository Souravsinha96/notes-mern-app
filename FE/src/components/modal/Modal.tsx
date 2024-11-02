import { createPortal } from 'react-dom';
import './Modal.css';
import Button from '../button/Button';
type Props = {
  open: boolean;
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  divider?: boolean; // Optional prop for divider
};

export const Modal = ({
  open,
  children,
  title,
  onClose,
  onSubmit,
  divider,
}: Props) => {
  const modalRoot = document.getElementById('modal-root');
  if (!open || !modalRoot) return null;
  return createPortal(
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-content">
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            autoFocus
            aria-label="Close"
            className="close-button"
            onClick={onClose}
          >
            &times;
          </button>
        </header>
        {divider && <hr />}
        <div className="modal-body">{children}</div>
        <footer className="modal-footer">
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} color="error">
            Submit
          </Button>
        </footer>
      </div>
    </div>,
    modalRoot
  );
};
