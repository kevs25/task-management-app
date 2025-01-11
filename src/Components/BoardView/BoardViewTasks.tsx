//This file reads the task, pass it down to task section component to view the tasks by each section and also handles drag and drop functionality
import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Task, TaskStatus } from "../../Types/task";
import { db } from "../../FireBaseConfig";
import TaskSection from "./TaskSection";
import Filters from "../Filters";
import AddTask from "../AddTask";
import SearchBar from "../SearchBar";
import result_not_found_icon from "../../assets/Results not found.svg";
import { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useUser } from "../../hooks/useUser";
export default function BoardViewTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectQuery, setSelectQuery] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  let filteredTasks = tasks;
  if (searchQuery !== "") {
    filteredTasks = tasks.filter((task) => {
      return task.title.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }
  if (selectQuery !== "") {
    filteredTasks = tasks.filter((task) => {
      return task.category.toLowerCase().includes(selectQuery.toLowerCase());
    });
  }
  if (dateRange[0] && dateRange[1]) {
    filteredTasks = filteredTasks.filter((task) => {
      const taskDate = task.dueDate;
      return taskDate! >= dateRange[0]! && taskDate! <= dateRange[1]!;
    });
  }

  const { user } = useUser();
  console.log("userID", user?.uid);

  useEffect(() => {
    if (user) {
      const fetchData = onSnapshot(
        collection(db, "users", user.uid, "tasks"),
        (snapshot) => {
          setTasks(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Task[]
          );
        }
      );
      return () => fetchData();
    }
  }, [user]);

  const getTaskPosition = (id: string) =>
    filteredTasks.findIndex((task) => task.id === id);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    const activeContainer = findContainer(String(active.id));
    const overContainer = findContainer(String(over.id));

    if (!activeContainer || !overContainer) {
      return;
    }

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    if (activeContainer !== overContainer) {
      const taskId = active.id;
      const newStatus = overContainer as TaskStatus;

      try {
        // Update task status for the correct user
        const taskRef = doc(db, "users", user.uid, "tasks", String(taskId));
        await updateDoc(taskRef, { status: newStatus });

        // Update the local state to reflect the new status
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    } else {
      const originalPosition = getTaskPosition(String(active.id));
      const newPosition = getTaskPosition(String(over.id));

      if (originalPosition !== newPosition) {
        setTasks((prevTasks) => {
          const reorderedTasks = arrayMove(
            [...prevTasks],
            originalPosition,
            newPosition
          );
          return reorderedTasks;
        });
      }
    }
  };

  const findContainer = (id: string) => {
    if (todoTasks.find((task) => task.id === id)) {
      return "TO-DO";
    }
    if (inProgressTasks.find((task) => task.id === id)) {
      return "IN-PROGRESS";
    }
    if (completedTasks.find((task) => task.id === id)) {
      return "COMPLETED";
    }
    if (id === "TO-DO") return "TO-DO";
    if (id === "IN-PROGRESS") return "IN-PROGRESS";
    if (id === "COMPLETED") return "COMPLETED";
    return null;
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100, 
        tolerance: 5, 
      },
    }),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates, 
    })
  );

  const todoTasks = filteredTasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = filteredTasks.filter(
    (task) => task.status === "IN-PROGRESS"
  );
  const completedTasks = filteredTasks.filter(
    (task) => task.status === "COMPLETED"
  );
  return (
    <>
      <div className="flex flex-wrap justify-between">
        <Filters
          onSelect={(categoryQuery) => setSelectQuery(categoryQuery)}
          onDateRangeSelect={(start, end) => setDateRange([start, end])}
        />
        <div className="relative flex gap-1">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
          <AddTask />
        </div>
      </div>
      <div className="my-8">
        {tasks.length > 0 && filteredTasks.length === 0 ? (
          <img
            className="flex flex-row items-center w-80 mx-auto"
            src={result_not_found_icon}
            alt="Result not found"
          />
        ) : (
          <div className="grid grid-cols-3 gap-4 touch-none">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              sensors={sensors}
            >
              <TaskSection
                title="TO-DO"
                tasks={todoTasks}
                style="bg-pink-200 text-pink-900 w-20"
                id="TO-DO"
              />

              <TaskSection
                title="IN-PROGRESS"
                tasks={inProgressTasks}
                style="bg-blue-200 text-blue-900 w-32"
                id="IN-PROGRESS"
              />

              <TaskSection
                title="COMPLETED"
                tasks={completedTasks}
                style="bg-green-200 text-green-900 w-28"
                id="COMPLETED"
              />
            </DndContext>
          </div>
        )}
      </div>
    </>
  );
}
