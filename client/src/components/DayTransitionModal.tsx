import { useState } from "react";
import { Task } from "../model";

const AUTO_ABANDON_DAYS = 7;

type TaskAction = "carry-over" | "completed" | "abandoned" | "deleted";

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

  const [actions, setActions] = useState<Map<number, TaskAction>>(() => {
    const map = new Map<number, TaskAction>();
    allTask.forEach((t) => map.set(t.id, "carry-over"));
    return map;
  });

  const setTaskAction = (id: number, action: TaskAction) => {
    setActions((prev) => {
      const next = new Map(prev);
      next.set(id, action);
      return next;
    });
  };

  const handleAbandonAll = () => {
    setActions((prev) => {
      const next = new Map(prev);
      allTask.forEach((t) => next.set(t.id, "abandoned"));
      return next;
    });
  };

  const handleStartToday = () => {
    const carryOver = allTask.filter(
      (t) => actions.get(t.id) === "carry-over"
    );
    onReviewComplete(carryOver);
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
  const carryOverCount = allTask.filter(
    (t) => actions.get(t.id) === "carry-over"
  ).length;

  const actionOptions: { value: TaskAction; label: string }[] = [
    { value: "carry-over", label: "Carry over" },
    { value: "completed", label: "Completed" },
    { value: "abandoned", label: "Abandoned" },
    { value: "deleted", label: "Delete" },
  ];

  return (
    <div className="modal__overlay">
      <div className="modal__container modal__container--review">
        <h2 className="modal__title">Welcome back!</h2>
        <p className="modal__subtitle">
          You were last here on{" "}
          {lastSeenDayKey ? formatDateLabel(lastSeenDayKey) : "a previous day"}.
        </p>

        {allTask.length > 0 && (
          <div className="modal__section">
            <h3 className="modal__section-heading">
              Active tasks{" "}
              <span className="modal__section-hint">
                ({carryOverCount}/{maxCarriedOver} carried over)
              </span>
            </h3>
            <div className="modal__task-list">
              {allTask.map((t) => {
                const action = actions.get(t.id) ?? "carry-over";
                const isStrikethrough =
                  action === "completed" || action === "abandoned" || action === "deleted";
                const carryOverDisabled =
                  action !== "carry-over" && carryOverCount >= maxCarriedOver;

                return (
                  <div key={t.id} className="modal__task">
                    <span
                      className={`modal__task-text${
                        isStrikethrough ? " modal__task--strikethrough" : ""
                      }`}
                    >
                      {t.task}
                    </span>
                    <div className="modal__actions">
                      {actionOptions.map((opt) => (
                        <button
                          key={opt.value}
                          className={`modal__action-pill${
                            action === opt.value
                              ? " modal__action-pill--active"
                              : ""
                          }`}
                          disabled={opt.value === "carry-over" && carryOverDisabled}
                          onClick={() => setTaskAction(t.id, opt.value)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="modal__section">
            <h3 className="modal__section-heading">Completed tasks</h3>
            <div className="modal__task-list">
              {completedTasks.map((t) => (
                <div key={t.id} className="modal__task modal__task--readonly">
                  <span className="modal__task-text modal__task--strikethrough">
                    {t.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal__footer">
          <button
            className="modal__btn modal__btn--secondary"
            onClick={handleAbandonAll}
          >
            Abandon All
          </button>
          <button
            className="modal__btn modal__btn--primary"
            disabled={carryOverCount > maxCarriedOver}
            onClick={handleStartToday}
          >
            Start today
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayTransitionModal;
