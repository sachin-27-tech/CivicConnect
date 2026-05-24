function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <div className="status-box error-box">{message}</div>;
}

export default ErrorMessage;

