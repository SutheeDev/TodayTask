export interface Task {
  id: number;
  task: string;
  description?: string;
  isCompleted: boolean;
  isFocused?: boolean;
  isCarriedOver?: boolean;
}
