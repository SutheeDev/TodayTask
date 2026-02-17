import { useState } from "react";
import { RiArrowDownSLine, RiCheckboxLine, RiCheckboxFill, RiTimeLine, RiTimeFill } from "react-icons/ri";
import { Task } from "../model";
import Toast from "./Toast";

const AUTO_ABANDON_DAYS = 7;

type TaskAction = "carry-over" | "completed";

interface Props {
  dayGap: number;
  lastSeenDayKey: string | null;
  allTask: Task[];
  completedTasks: Task[];
  onDismiss: () => void;
  onReviewComplete: (active: Task[]) => void;
  maxCarriedOver: number;
}

const GREETING_MESSAGES = [
  "What deserves your attention today?",
  "A fresh day. What matters most?",
  "One thing at a time. What's first?",
  "Ready to make today count?",
  "What's worth your focus today?",
  "Clear your mind. Pick what matters.",
];

const formatDateLabel = (dayKey: string): string => {
  const date = new Date(dayKey + "T00:00:00");
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DayTransitionModal: React.FC<Props> = ({
  dayGap,
  lastSeenDayKey,
  allTask,
  completedTasks,
  onDismiss,
  onReviewComplete,
  maxCarriedOver,
}) => {
  const [greetingMessage] = useState(
    () => GREETING_MESSAGES[Math.floor(Math.random() * GREETING_MESSAGES.length)]
  );

  // Split tasks into 3 groups
  const focusedTasks = allTask.filter((t) => t.isFocused);
  const carriedOverTasks = allTask.filter((t) => t.isCarriedOver && !t.isFocused);
  const activeTasks = allTask.filter((t) => !t.isFocused && !t.isCarriedOver);

  const [actions, setActions] = useState<Map<number, TaskAction | null>>(() => {
    const map = new Map<number, TaskAction | null>();
    let slots = maxCarriedOver;
    // Only pre-select carried-over tasks; focused and active start with null
    for (const t of carriedOverTasks) {
      map.set(t.id, slots > 0 ? "carry-over" : null);
      if (slots > 0) slots--;
    }
    for (const t of [...focusedTasks, ...activeTasks]) {
      map.set(t.id, null);
    }
    return map;
  });

  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const carryOverCount = allTask.filter(
    (t) => actions.get(t.id) === "carry-over"
  ).length;

  const setTaskAction = (id: number, action: TaskAction) => {
    const current = actions.get(id) ?? null;
    if (current === action) {
      setLimitMessage(null);
      setActions((prev) => {
        const next = new Map(prev);
        next.set(id, null);
        return next;
      });
      return;
    }
    if (action === "carry-over" && carryOverCount >= maxCarriedOver) {
      setLimitMessage(
        `You can only carry over ${maxCarriedOver} tasks. Change another task first.`
      );
      return;
    }
    setLimitMessage(null);
    setActions((prev) => {
      const next = new Map(prev);
      next.set(id, action);
      return next;
    });
  };

  const handleCompleteAll = () => {
    setLimitMessage(null);
    setActions((prev) => {
      const next = new Map(prev);
      allTask.forEach((t) => next.set(t.id, "completed"));
      return next;
    });
  };

  const unresolvedCount = allTask.filter(
    (t) => actions.get(t.id) === null
  ).length;

  const handleStartToday = () => {
    if (unresolvedCount > 0) {
      setToastMessage("Please decide on all tasks before continuing.");
      return;
    }
    const carryOver = allTask.filter(
      (t) => actions.get(t.id) === "carry-over"
    );
    onReviewComplete(carryOver);
  };

  const handleTextEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const el = e.currentTarget;
    if (el.scrollWidth > el.clientWidth) {
      const overflow = el.scrollWidth - el.clientWidth;
      const duration = 0.3 + overflow / 120;
      el.style.setProperty('--overflow', `-${overflow}px`);
      el.style.setProperty('--slide-duration', `${duration}s`);
      el.classList.add('modal__task-text--sliding');
    }
  };

  const handleTextLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.currentTarget.classList.remove('modal__task-text--sliding');
  };

  const renderTaskRow = (t: Task) => {
    const action = actions.get(t.id) ?? null;
    const isStrikethrough = action === "completed";
    const carryOverDisabled =
      action !== "carry-over" && carryOverCount >= maxCarriedOver;

    return (
      <div key={t.id} className="modal__task">
        <span
          className={`modal__task-text${
            isStrikethrough ? " modal__task--strikethrough" : ""
          }`}
          onMouseEnter={handleTextEnter}
          onMouseLeave={handleTextLeave}
        >
          <span className="modal__task-inner">
            {t.task}
          </span>
        </span>
        <div className="modal__actions">
          <span
            className={`modal__action-icon${action === "carry-over" ? " modal__action-icon--active" : ""}${carryOverDisabled ? " modal__action-icon--disabled" : ""}`}
            data-tooltip="Carry over"
            onClick={() => setTaskAction(t.id, "carry-over")}
          >
            {action === "carry-over" ? <RiTimeFill /> : <RiTimeLine />}
          </span>
          <span
            className={`modal__action-icon${action === "completed" ? " modal__action-icon--active" : ""}`}
            data-tooltip="Complete"
            onClick={() => setTaskAction(t.id, "completed")}
          >
            {action === "completed" ? <RiCheckboxFill /> : <RiCheckboxLine />}
          </span>
        </div>
      </div>
    );
  };

  // A) Greeting — no active tasks
  if (allTask.length === 0) {
    return (
      <div className="modal__overlay">
        <div className="modal__container">
          <h2 className="modal__title">{greetingMessage}</h2>
          <button className="modal__btn modal__btn--primary" onClick={onDismiss}>
            Let's go
          </button>
        </div>
      </div>
    );
  }

  // C) Auto-abandoned — 7+ day gap with active tasks
  if (dayGap >= AUTO_ABANDON_DAYS) {
    return (
      <div className="modal__overlay">
        <div className="modal__container modal__container--review">
          <h2 className="modal__title">Welcome back!</h2>
          <p className="modal__subtitle">
            You were away since{" "}
            {lastSeenDayKey ? formatDateLabel(lastSeenDayKey) : "a previous day"}.
            Your pending tasks were automatically abandoned.
          </p>

          <div className="modal__section">
            <div className="modal__task-list">
              {allTask.map((t) => (
                <div key={t.id} className="modal__task modal__task--readonly">
                  <span className="modal__task-text modal__task--strikethrough">
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal__footer">
            <button
              className="modal__btn modal__btn--primary"
              onClick={() => onReviewComplete([])}
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // B) Review — 1–6 day gap with active tasks
  return (
    <div className="modal__overlay">
      <div className="modal__container modal__container--review">
        <h2 className="modal__title">Welcome back!</h2>
        <p className="modal__subtitle">
          You were last here on{" "}
          {lastSeenDayKey ? formatDateLabel(lastSeenDayKey) : "a previous day"}.
        </p>

        {carriedOverTasks.length > 0 && (
          <div className="modal__section modal__section--carried-over">
            <h3 className="modal__section-heading">Carried over (previously)</h3>
            <div className="modal__task-list">
              {carriedOverTasks.map((t) => renderTaskRow(t))}
            </div>
          </div>
        )}

        {focusedTasks.length > 0 && (
          <div className="modal__section modal__section--focused">
            <h3 className="modal__section-heading">Focused (from yesterday)</h3>
            <div className="modal__task-list">
              {focusedTasks.map((t) => renderTaskRow(t))}
            </div>
          </div>
        )}

        {activeTasks.length > 0 && (
          <div className="modal__section modal__section--active">
            <h3 className="modal__section-heading">Active tasks</h3>
            <div className="modal__task-list">
              {activeTasks.map((t) => renderTaskRow(t))}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (() => {
          const visibleCompleted =
            completedTasks.length <= 3 || completedExpanded
              ? completedTasks
              : completedTasks.slice(0, 3);
          const hiddenCount = completedTasks.length - 3;

          return (
            <div className="modal__section modal__section--completed">
              <h3 className="modal__section-heading">Completed tasks</h3>
              <div className="modal__task-list">
                {visibleCompleted.map((t) => (
                  <div key={t.id} className="modal__task modal__task--readonly">
                    <span className="modal__task-text modal__task--strikethrough">
                      {t.task}
                    </span>
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <button
                    className="modal__expand-toggle"
                    onClick={() => setCompletedExpanded((prev) => !prev)}
                  >
                    <RiArrowDownSLine className={completedExpanded ? "modal__expand-toggle--flipped" : ""} />
                    {completedExpanded ? "Show less" : `Show ${hiddenCount} more`}
                  </button>
                )}
              </div>
            </div>
          );
        })()}

        <div className="modal__carry-over-status">
          <span
            className={`modal__carry-over-count${
              carryOverCount >= maxCarriedOver
                ? " modal__carry-over-count--at-limit"
                : ""
            }`}
          >
            {carryOverCount}/{maxCarriedOver} carried over
          </span>
          {limitMessage && (
            <span className="modal__limit-message">{limitMessage}</span>
          )}
        </div>

        <div className="modal__footer">
          <button
            className="modal__btn modal__btn--secondary"
            onClick={handleCompleteAll}
          >
            Complete All
          </button>
          <button
            className={`modal__btn modal__btn--primary${unresolvedCount > 0 ? " modal__btn--muted" : ""}`}
            disabled={carryOverCount > maxCarriedOver}
            onClick={handleStartToday}
          >
            Start today
          </button>
        </div>

        <Toast
          message={toastMessage}
          onDismiss={() => setToastMessage(null)}
        />
      </div>
    </div>
  );
};

export default DayTransitionModal;
