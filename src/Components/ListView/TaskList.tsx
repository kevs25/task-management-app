import drag_icon from "../../assets/drag_icon.svg";
import checkMark from "../../assets/checkmark.svg";
import completed_checkmark from "../../assets/completed_checkmark.svg";
import { TaskDropdown } from "./TaskDropDown";
import formatDate from "../../Utils/DateFormat";
import { Task } from "../../Types/task";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskListProps {
  task: Task;
  title: string;
  selectedTasks: Set<string>;
  onSelect: (taskId: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskList = ({
  task,
  title,
  selectedTasks,
  onSelect,
  onEdit,
  onDelete,
}: TaskListProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  } as const;

  return (
    <div
      data-swap-slot={task.id}
      className="grid grid-cols-6 md:grid-cols-6 gap-1 border-b-2 p-2 touch-none"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
    >
      <div className="flex flex-row gap-2 md:col-span-2 max-md:col-span-5">
        <input
          type="checkbox"
          checked={selectedTasks.has(task.id)}
          onChange={() => onSelect(task.id)}
          className="size-4"
        />
        <img
          src={drag_icon}
          alt="Drag Icon"
          className="hidden md:block size-4"
        />
        <img
          src={title === "Completed" ? completed_checkmark : checkMark}
          alt="Status"
          className="w-6 h-6"
        />
        <span className="capitalize">{task.title}</span>
      </div>
      <div className="col-span-1 text-sm font-medium capitalize hidden md:block">
        {task.dueDate && formatDate(task.dueDate)}
      </div>
      <div className="col-span-1 text-sm text-gray-500 hidden md:block">
        {task.status}
      </div>
      <div className="col-span-1 sm:col-span-1 text-sm text-gray-500 hidden md:block">
        {task.category}
      </div>
      <div className="flex justify-end col-span-1 md:col-span-1">
        <TaskDropdown
          onEdit={(e) => {
            e.stopPropagation();
            onEdit(task.id);
          }}
          onDelete={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        />
      </div>
    </div>
  );
};

export default TaskList;
