import { useEffect, useRef, useState } from "react";

const LIMIT_MESSAGES = [
  "Your plate is full — finish something first",
  "Seven is enough for today. Finish one to add another.",
  "All slots filled — complete one to make room",
  "Less is more. Complete a task to continue.",
];

interface Props {
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (e: React.FormEvent) => void;
  isAtLimit: boolean;
}

const InputField = ({
  task,
  setTask,
  description,
  setDescription,
  handleAddTask,
  isAtLimit,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [showDescription, setShowDescription] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [limitMessage, setLimitMessage] = useState(
    () => LIMIT_MESSAGES[Math.floor(Math.random() * LIMIT_MESSAGES.length)]
  );

  useEffect(() => {
    if (isAtLimit) {
      setLimitMessage(
        LIMIT_MESSAGES[Math.floor(Math.random() * LIMIT_MESSAGES.length)]
      );
    }
  }, [isAtLimit]);

  const handleFormFocus = () => {
    setIsFocused(true);
  };

  const handleFormBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    if (e.relatedTarget && formRef.current?.contains(e.relatedTarget)) {
      return;
    }
    // Defer check — unmounting textarea fires a spurious blur with null relatedTarget
    setTimeout(() => {
      if (formRef.current?.contains(document.activeElement)) {
        return;
      }
      setIsFocused(false);
      setShowDescription(false);
    }, 0);
  };

  const handleTextareaKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  if (isAtLimit) {
    return (
      <div className="input input__limit-message">
        {limitMessage}
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="input"
      onFocus={handleFormFocus}
      onBlur={handleFormBlur}
      onSubmit={(e) => {
        handleAddTask(e);
        setShowDescription(false);
        setIsFocused(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }}
    >
      <div className="input__wrapper">
        <input
          ref={inputRef}
          type="input"
          placeholder="Enter your task"
          className="input__field"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onClick={() => {
            if (showDescription) {
              setShowDescription(false);
            }
          }}
        />
        {(isFocused || showDescription) && (
          <button
            type="button"
            className="input__toggle-desc"
            onClick={() => {
              if (showDescription) {
                inputRef.current?.focus();
              }
              setShowDescription(!showDescription);
            }}
          >
            {showDescription ? "Hide description" : "Add description"}
          </button>
        )}
        <button type="submit" className="input__btn">
          Enter
        </button>
      </div>
      {showDescription && (
        <textarea
          className="input__description"
          placeholder="Add a description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleTextareaKeyDown}
          rows={3}
        />
      )}
    </form>
  );
};
export default InputField;
