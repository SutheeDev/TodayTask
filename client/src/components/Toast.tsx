import { useEffect } from "react";

interface Props {
  message: string | null;
  onDismiss: () => void;
}

const Toast = ({ message, onDismiss }: Props) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div className="toast" onClick={onDismiss}>
      {message}
    </div>
  );
};

export default Toast;
