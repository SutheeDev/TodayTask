interface Props {
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
  handleAddTask: (e: React.FormEvent) => void;
}

const InputField = ({ task, setTask, handleAddTask }: Props) => {
  return (
    <form className="input" onSubmit={(e) => handleAddTask(e)}>
      <input
        type="input"
        placeholder="Enter your task"
        className="input__field"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button type="submit" className="input__btn">
        Enter
      </button>
    </form>
  );
};
export default InputField;
