import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { Task } from "../../Types/task";
import { db } from "../../FireBaseConfig";
import EditTask from "../EditTask"; // Import the EditTask component
import BoardTask from "./BoardTask";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { useUser } from "../../hooks/useUser";

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  style: string;
  id: string;
}

export default function TaskSection({ title, tasks, style, id }: TaskSectionProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { setNodeRef } = useDroppable({
      id: id,
    });

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  const handleEditClose = () => {
    setIsEditModalOpen(false);
    setSelectedTask(null);
  };
  const { user }= useUser();
  const handleDelete = async (taskId: string) => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }
  
    try {
      // Delete the task for the specific user
      await deleteDoc(doc(db, "users", user.uid, "tasks", taskId));
      console.log("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  return (
    <>
      <div className="bg-gray-100 rounded-lg p-4 min-h-[calc(100vh-8rem)] shadow-sm" ref={setNodeRef}>
        <div
          className={`rounded-md px-3 py-1 text-sm font-medium mb-4 ${style}`}
        >
          {title}
        </div>
        {tasks.length > 0 ? (
          <SortableContext
            items={tasks.map((task) => task.id)} // Change this to pass just IDs
            strategy={rectSortingStrategy}
          >
            {tasks.map((task) => (
              
              <BoardTask
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="text-center text-gray-500 text-sm mt-4">
            No Tasks in {title === "TO-DO" ? "To-Do" : title}
          </div>
        )}
      </div>

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTask
          task={selectedTask}
          isModalOpen={isEditModalOpen}
          onClose={handleEditClose}
        />
      )}
    </>
  );
}
