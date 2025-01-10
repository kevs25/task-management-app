import { useSortable } from "@dnd-kit/sortable";
import { Task } from "../../Types/task";
import formatDate from "../../Utils/DateFormat";
import { TaskDropdown } from "../ListView/TaskDropDown";
import { CSS } from "@dnd-kit/utilities";

interface TaskListProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function BoardTask({ task, onEdit, onDelete }: TaskListProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  } as const;
  return (
    <div
      data-swap-slot={task.id}
      key={task.id}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="flex flex-col gap-4 bg-white rounded-md p-3 mb-2 shadow-sm"
    >
      <div className="flex flex-row justify-between items-start">
        <div className="flex-1">
          <p className="text-md capitalize font-medium">{task.title}</p>
          {task.description && (
            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
          )}
        </div>
        <TaskDropdown
          onEdit={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          onDelete={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
          {task.category}
        </span>
        <p className="text-xs text-gray-500">
          {task.dueDate && formatDate(task.dueDate)}
        </p>
      </div>
    </div>
  );
}
