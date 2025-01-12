//this file handles a edit task modal to edit a new task
import { useState, useEffect } from "react";
import Modal from "react-modal";
import TextEditor from "./TextEditor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { Task } from "../Types/task";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../FireBaseConfig";
import { format } from "date-fns";
import { useUser } from "../hooks/useUser";
import { ActivityLog } from "../Types/task";
import ActivityLogView from "./ActivityLogView";
import close_icon from "../assets/Close Icon.svg";
interface EditTaskProps {
  task: Task;
  onClose: () => void;
  isModalOpen: true | false;
}
// interface FileReference {
//   name: string;
//   size: number;
//   type: string;
//   lastModified: number;
// }

export default function EditTask({
  task,
  onClose,
  isModalOpen,
}: EditTaskProps) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [status, setStatus] = useState("Choose");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [isActivity, setIsActivity] = useState(true);

  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "");
      setTaskCategory(task.category || "");
      setDueDate(task.dueDate ? new Date(task.dueDate) : null);
      setStatus(task.status || "Choose");
      setDescription(task.description || "");
    }
  }, [task]);

  const handleCategoryClick = (category: string) => {
    setTaskCategory(category);
  };

  // const createFileReferences = (files: File[]): FileReference[] => {
  //   return files.map((file) => ({
  //     name: file.name,
  //     size: file.size,
  //     type: file.type,
  //     lastModified: file.lastModified,
  //   }));
  // };

  const logDynamicActivity = async (
    taskId: string,
    userId: string,
    prevState: Task,
    newState: Task
  ) => {
    const taskRef = doc(db, "users", userId, "tasks", taskId);
    const activityLog: ActivityLog[] = [];

    Object.keys(newState).forEach((key) => {
      if (
        key !== "activityLog" &&
        key !== "updatedAt" &&
        key !== "createdAt" &&
        key !== "attachments"
      ) {
        const prevValue = prevState[key as keyof Task];
        const newValue = newState[key as keyof Task];

        if (prevValue !== newValue) {
          activityLog.push({
            action: `Changed ${key}`,
            timestamp: new Date().toISOString(),
            details: `Updated "${key}" from "${prevValue}" to "${newValue}"`,
          });
        }
      }
    });

    if (activityLog.length > 0) {
      try {
        await updateDoc(taskRef, {
          activityLog: arrayUnion(...activityLog),
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error logging activity:", error);
      }
    }
  };

  const { user } = useUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    try {
      // const fileReferences = createFileReferences(uploadedFile);

      const taskData = {
        title: taskTitle,
        description,
        category: taskCategory,
        dueDate: dueDate ? format(dueDate, "MMM dd, yyyy") : null,
        status,
        attachments: "",
        updatedAt: new Date(),
      };

      const taskRef = doc(db, "users", user.uid, "tasks", task.id);

      const taskSnapshot = await getDoc(taskRef);
      if (!taskSnapshot.exists()) {
        console.error("Task not found");
        return;
      }

      console.log("taskRef", taskRef);
      const prevState = taskSnapshot.data() as Task;
      console.log("prevState", prevState);

      await updateDoc(taskRef, taskData);
      await logDynamicActivity(task.id, user.uid, prevState, {
        ...prevState,
        ...taskData,
      });

      onClose();
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        (file) => file.size <= 5000000
      );
      setUploadedFile(files);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-[95%] md:w-[80%] lg:w-[80%] max-w-[100%] max-h-[60%] overflow-y-auto my-8 max-md:max-h-[80%]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="hidden max-md:inline-block w-full">
          <div className="flex flex-row p-2 justify-end">
            <button onClick={handleClose}>
              <img src={close_icon} alt="" />
            </button>
          </div>
          <div className="grid grid-cols-2 justify-center gap-4 p-2">
            <button className={`p-2 rounded-full border ${isActivity ? "bg-black text-white" : "bg-white text-black"}`} onClick={() => setIsActivity(true)}>
              Details
            </button>
            <button className={`p-2 rounded-full border ${isActivity ? "bg-white text-black" : "bg-black text-white"}`} onClick={() => setIsActivity(false)}>
              Activity
            </button>
          </div>
        </div>
        {
          isActivity ? (

        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-4 md:p-6 w-auto gap-3 max-md:w-full"
        >
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="border border-gray-300 p-2 bg-[#f1f1f1] w-full rounded-lg placeholder:text-black opacity-40 font-mulish"
            placeholder="Task Title"
          />
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full">
              <div className="h-32 md:h-40">
                <TextEditor value={description} onChangeText={setDescription} />
              </div>
              <div className="flex flex-col md:flex-row justify-between gap-3 py-2 mt-4 max-md:mt-10">
                <div className="flex flex-col gap-1.5">
                  <label className="opacity-50 text-sm">
                    Task Category
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => handleCategoryClick("work")}
                      className={`w-24 ${
                        task?.category === "WORK"
                          ? "bg-purple-900 text-white text-sm"
                          : "hover:bg-purple-100 text-sm rounded-full border border-gray-300 p-1.5"
                      }`}
                    >
                      Work
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick("personal")}
                      className={`w-24 ${
                        task?.category === "PERSONAL"
                          ? "bg-purple-900 text-white text-sm"
                          : "hover:bg-purple-100 text-sm rounded-full border border-gray-300 p-1.5"
                      }`}
                    >
                      Personal
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="opacity-50 text-sm">
                    Due Date
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={dueDate}
                      onChange={(date: Date | null) => setDueDate(date)}
                      className="w-full max-md:w-40 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700"
                      placeholderText="DD/MM/YYYY"
                      dateFormat="dd, MMM yyyy"
                    />
                    <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-500 max-md:left-32" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="opacity-50 text-sm">
                    Status
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full md:w-40 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700 opacity-50"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="" disabled selected hidden>
                      Choose
                    </option>
                    <option value="TO-DO">TO-DO</option>
                    <option value="IN-PROGRESS">IN-PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="opacity-50 text-sm">Attachments</p>
                <label
                  htmlFor="file-drop"
                  className="border border-gray-300 p-2 bg-[#f1f1f1] w-full opacity-90 text-center rounded-lg cursor-pointer text-sm"
                >
                  Drop your files here
                  <input
                    type="file"
                    id="file-drop"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <div className="mt-1">
                  {uploadedFile.map((file, index) => (
                    <div key={index}>
                      <p className="text-sm text-gray-700">{file.name}</p>
                      <img
                        src={URL.createObjectURL(file)}
                        className="w-20"
                        alt=""
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden md:inline-block">
              <ActivityLogView task={task} />
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pink-500 text-white rounded-full text-sm"
            >
              Update
            </button>
          </div>
        </form>
          ) : (
            <ActivityLogView task={task} />
          )
        }
      </Modal>
    </>
  );
}
