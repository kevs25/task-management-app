//This file reads the task, pass it down to task section component to view the tasks by each section and also handles drag and drop functionality
//Also handles sorting based on due dates and search by title filter

import { useEffect, useMemo, useState } from "react";
import TaskSection from "./TaskSection";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { Task, TaskStatus } from "../../Types/task";
import { db } from "../../FireBaseConfig";
import Filters from "../Filters";
import SearchBar from "../SearchBar";
import AddTask from "../AddTask";
import result_not_found_icon from "../../assets/Results not found.svg";
import sort_asc_icon from "../../assets/sort_asc_icon.svg";
import sort_desc_icon from "../../assets/sort_desc_icon.svg";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useUser } from "../../hooks/useUser";

export default function ListViewTasks() {
  const [sections, setSections] = useState({
    todo: true,
    inProgress: true,
    completed: true,
  });
  const [openAddTaskForm, setOpenAddTaskForm] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectQuery, setSelectQuery] = useState("");
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortedTasks, setSortedTasks] = useState<Task[]>([]);

  const handleSort = (order: "asc" | "desc") => {
    const sortedArray = [...sortedTasks].sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });
    setSortedTasks(sortedArray);
  };

  const { user } = useUser();

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

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleShowTaskForm = () => {
    setOpenAddTaskForm(true);
  };

  const handleCloseForm = () => {
    setOpenAddTaskForm(false);
  };

  const filteredTasks = useMemo(() => {
    let filtered = tasks;
    if (searchQuery !== "") {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectQuery !== "") {
      filtered = filtered.filter((task) =>
        task.category.toLowerCase().includes(selectQuery.toLowerCase())
      );
    }
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter((task) => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : null;
        return (
          taskDate && taskDate >= dateRange[0]! && taskDate <= dateRange[1]!
        );
      });
    }

    return filtered;
  }, [tasks, searchQuery, selectQuery, dateRange]);

  useEffect(() => {
    setSortedTasks(filteredTasks);
  }, [filteredTasks]);

  const toggleSortOrder = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    handleSort(newOrder);
  };
  const todoTasks = sortedTasks.filter((task) => task.status === "TO-DO");
  const inProgressTasks = sortedTasks.filter(
    (task) => task.status === "IN-PROGRESS"
  );
  const completedTasks = sortedTasks.filter(
    (task) => task.status === "COMPLETED"
  );

  const getTaskPosition = (id: string) =>
    sortedTasks.findIndex((task) => task.id === id);

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
        const taskRef = doc(db, "users", user.uid, "tasks", String(taskId));
        await updateDoc(taskRef, { status: newStatus });

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
      console.log(`Task ${id} found in TO-DO`);
      return "TO-DO";
    }
    if (inProgressTasks.find((task) => task.id === id)) {
      console.log(`Task ${id} found in IN-PROGRESS`);
      return "IN-PROGRESS";
    }
    if (completedTasks.find((task) => task.id === id)) {
      console.log(`Task ${id} found in COMPLETED`);
      return "COMPLETED";
    }
    if (id === "TO-DO") return "TO-DO";
    if (id === "IN-PROGRESS") return "IN-PROGRESS";
    if (id === "COMPLETED") return "COMPLETED";
    console.warn(`Task ${id} not found in any container`);
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

  return (
    <>
      <div className="flex flex-wrap justify-between">
        <Filters
          onSelect={(categoryQuery) => setSelectQuery(categoryQuery)}
          onDateRangeSelect={(start, end) => setDateRange([start, end])}
        />
        <div className="relative flex gap-1 max-md:w-full">
          <SearchBar onSearch={(query) => setSearchQuery(query)} />
          <div className="hidden md:inline-block">
            <AddTask />
          </div>
        </div>
      </div>
      {tasks.length > 0 && filteredTasks.length === 0 ? (
        <img
          className="flex flex-row items-center w-80 mx-auto"
          src={result_not_found_icon}
          alt="Result not found"
        />
      ) : (
        <div className="w-auto p-2 sm:p-2">
          <div className="grid grid-cols-6 md:grid-cols-6 gap-4 px-4 py-2 bg-gray-50 text-sm font-medium text-gray-600">
            <div className="hidden md:block md:col-span-2">Task name</div>
            <div className="hidden md:block">
              <div className="flex flex-row gap-2 items-center">
                <p>Due on</p>
                <div className="flex flex-col w-10 gap-1">
                  <button onClick={() => toggleSortOrder()}>
                    <img
                      src={sort_asc_icon}
                      alt="Sort Ascending"
                      className="w-3"
                    />
                  </button>
                  <button onClick={() => toggleSortOrder()}>
                    <img
                      src={sort_desc_icon}
                      alt="Sort Descending"
                      className="w-3"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block">Status</div>
            <div className="hidden md:block">Category</div>
            <div className=""></div>
          </div>

          <DndContext
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <TaskSection
              title="Todo"
              color="bg-[#FAC3FF]"
              isOpen={sections.todo}
              onToggle={() => toggleSection("todo")}
              count={todoTasks.length}
              tasks={todoTasks}
              isAddingTask={openAddTaskForm}
              onAddTask={handleShowTaskForm}
              onCloseForm={handleCloseForm}
              id="TO-DO"
            />

            <TaskSection
              title="In-Progress"
              color="bg-[#85D9F1]"
              isOpen={sections.inProgress}
              onToggle={() => toggleSection("inProgress")}
              count={inProgressTasks.length}
              tasks={inProgressTasks}
              id="IN-PROGRESS"
            />

            <TaskSection
              title="Completed"
              color="bg-[#CEFFCC]"
              isOpen={sections.completed}
              onToggle={() => toggleSection("completed")}
              count={completedTasks.length}
              tasks={completedTasks}
              id="COMPLETED"
            />
          </DndContext>
        </div>
      )}
    </>
  );
}
