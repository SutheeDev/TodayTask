interface Props {
  task: string;
  setTask: React.Dispatch<React.SetStateAction<string>>;
}

const InputField = ({ task, setTask }: Props) => {
  return (
    <form className="input">
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
