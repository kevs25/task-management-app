import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { Task } from "../../Types/task";
import TaskForm from "./TaskForm";
import { db } from "../../FireBaseConfig";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import Modal from "react-modal";
import MultiSelectModal from "./MultiSelectModal";
import EditTask from "../EditTask";
// import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskList from "./TaskList";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useUser } from "../../hooks/useUser";

interface TaskSectionProps {
  id: string;
  title: string;
  color: string;
  isOpen: boolean;
  onToggle: () => void;
  count: number;
  tasks: Task[];
  isAddingTask?: boolean;
  onAddTask?: () => void;
  onCloseForm?: () => void;
}

const TaskSection = ({
  id,
  title,
  color,
  isOpen,
  onToggle,
  count,
  tasks = [],
  isAddingTask = false,
  onAddTask,
  onCloseForm,
}: TaskSectionProps) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const { setNodeRef } = useDroppable({
    id: id,
  });

  // const handleSelect = (taskId: string) => {
  //   setSelectedTasks((prev) => {
  //     const newSelected = new Set(prev);
  //     if (newSelected.has(taskId)) {
  //       newSelected.delete(taskId);
  //     } else {
  //       newSelected.add(taskId);
  //     }

  //     if (newSelected.size > 0 && !isModalOpen) {
  //       setIsModalOpen(true);
  //     } else if (newSelected.size === 0 && isModalOpen) {
  //       setIsModalOpen(false);
  //     }

  //     return newSelected;
  //   });
  // };
  const handleSelect = (taskId: string) => {
    setSelectedTasks((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(taskId)) {
        newSelected.delete(taskId);
      } else {
        newSelected.add(taskId);
      }

      if (newSelected.size > 0) {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }

      return newSelected;
    });
  };

  const handleEdit = (taskId: string) => {
    setEditTaskId(taskId);
  };
  const { user } = useUser();

  const handleDelete = async (taskId: string | Set<string>) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      if (taskId instanceof Set) {
        // Deleting multiple tasks
        const deletePromises = Array.from(taskId).map((id) =>
          deleteDoc(doc(db, "users", user.uid, "tasks", id))
        );
        await Promise.all(deletePromises); // Batch delete tasks
  
        // Clear selected tasks after deletion
        setSelectedTasks(new Set());
      } else {
        // Deleting a single task
        await deleteDoc(doc(db, "users", user.uid, "tasks", taskId)); // Single task delete
        setSelectedTasks(new Set()); // Clear selected tasks
      }
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };
  

  const handleStatusChange = async (newStatus: string) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    try {
      const updates = Array.from(selectedTasks).map((taskId) =>
        updateDoc(doc(db, "users", user.uid, "tasks", taskId), {
          status: newStatus,
        })
      );
      await Promise.all(updates);
      setSelectedTasks(new Set());
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return (
    <div className="mb-4" ref={setNodeRef}>
      <div className="flex flex-col">
        <div
          className={`flex items-center justify-between p-3 cursor-pointer ${color}`}
          onClick={onToggle}
        >
          <div className="flex items-center space-x-2">
            <span className="font-medium">{title}</span>
            <span className="text-gray-700">({count})</span>
          </div>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        {isOpen && (
          <div className="bg-gray-50 p-4 rounded-b-lg border-b-2">
            {title === "Todo" && (
              <div className="max-md:hidden">
                {!isAddingTask && onAddTask && (
                  <button
                    className="flex items-center text-gray-600 mb-4 hover:text-gray-800"
                    onClick={onAddTask}
                  >
                    <Plus size={20} className="mr-2" />
                    <span className="hidden sm:inline">ADD TASK</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                )}
                {isAddingTask && onCloseForm && (
                  <TaskForm onClose={onCloseForm} />
                )}
              </div>
            )}

            {tasks.length === 0 ? (
              <div className="text-center text-gray-500">
                No Tasks in {title}
              </div>
            ) : (
              <SortableContext
                items={tasks.map((task) => task.id)} // Pass just IDs
                strategy={verticalListSortingStrategy}
              >
                {tasks.map((task) => (
                  <TaskList
                    key={task.id}
                    task={task}
                    title={title}
                    selectedTasks={selectedTasks}
                    onSelect={handleSelect}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </SortableContext>
            )}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          contentLabel="MultiSelect Modal"
          className="modal"
          overlayClassName="overlay"
        >
          <MultiSelectModal
            selectedCount={selectedTasks.size}
            onClose={() => setIsModalOpen(false)}
            onDelete={() => handleDelete(selectedTasks)}
            onStatusChange={(status) => handleStatusChange(status)}
          />
        </Modal>
        {editTaskId && (
          <EditTask
            key={editTaskId}
            task={tasks.find((task) => task.id === editTaskId)!}
            onClose={() => setEditTaskId(null)}
            isModalOpen={!!editTaskId}
          />
        )}
      </div>
    </div>
  );
};

export default TaskSection;
