import { useState } from "react";
import Modal from "react-modal";
import TextEditor from "./TextEditor";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../FireBaseConfig";
import { format } from "date-fns";
import { useUser } from "../hooks/useUser";

export default function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"WORK" | "PERSONAL">("WORK");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<"TO-DO" | "IN-PROGRESS" | "COMPLETED">(
    "TO-DO"
  );

  const [attachments, setAttachments] = useState<File[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const taskData = {
  //     title,
  //     description,
  //     category,
  //     dueDate: dueDate ? format(dueDate, "MMM dd, yyyy") : null,
  //     status,
  //     attachments: attachments.map((file) => file.name),
  //     createdAt: format(new Date(), "MMM dd, yyyy")
  //   };

  //   try {
  //     await addDoc(collection(db, "tasks"), taskData);
  //     resetForm();
  //     setIsModalOpen(false);
  //   } catch (error) {
  //     console.error("Error adding task: ", error);
  //   }
  // };
  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const taskData = {
      title,
      description,
      category,
      dueDate: dueDate ? format(dueDate, "MMM dd, yyyy") : null,
      status,
      attachments: attachments.map((file) => file.name),
      createdAt: format(new Date(), "MMM dd, yyyy"),
    };

    try {
      // Ensure userId is a string and correct Firestore reference
      const userTasksCollectionRef = collection(db, "users", user.uid, "tasks");
      const newTaskRef = await addDoc(userTasksCollectionRef, taskData);
      console.log("Task added with ID:", newTaskRef.id);

      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("WORK");
    setDueDate(null);
    setStatus("TO-DO");
    setAttachments([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg w-[95%] md:w-[80%] lg:w-[60%] max-w-4xl max-h-[90vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        ariaHideApp={false}
      >
        <div className="sticky top-0 bg-white py-3 px-4 md:px-6 flex flex-row justify-between border-b border-gray-300 z-10">
          <p className="text-lg font-medium">Create Task</p>
          <button
            onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}
            className="text-lg font-medium hover:text-gray-700"
          >
            x
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col p-4 md:p-6 w-auto gap-3"
        >
          <input
            type="text"
            className="border border-gray-300 p-2 bg-[#f1f1f1] w-full rounded-lg placeholder:text-black opacity-40 font-mulish"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="h-32 md:h-40">
            <TextEditor
              value={description}
              onChangeText={(value) => setDescription(value)}
            />
          </div>
          <div className="flex flex-col md:flex-row justify-between gap-3 py-2 mt-4">
            <div className="flex flex-col gap-1.5">
              <label className="opacity-50 text-sm">
                Task Category
                <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCategory("WORK")}
                  className={`w-24 ${
                    category === "WORK"
                      ? "bg-purple-900 text-white text-sm hover:bg-purple-700 rounded-full p-1.5 border border-gray-300"
                      : "hover:bg-purple-100 text-sm rounded-full border border-gray-300 p-1.5"
                  }`}
                >
                  Work
                </button>
                <button
                  type="button"
                  onClick={() => setCategory("PERSONAL")}
                  className={`w-24 ${
                    category === "PERSONAL"
                      ? "bg-purple-900 text-white text-sm hover:bg-purple-700 rounded-full p-1.5"
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
                  onChange={(date) => setDueDate(date)}
                  className="w-full md:w-40 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700"
                  placeholderText="DD/MM/YYYY"
                  dateFormat="dd, MMM yyyy"
                />
                <Calendar className="absolute right-3 top-2 h-4 w-4 text-gray-500" />
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
                onChange={(e) =>
                  setStatus(
                    e.target.value as "TO-DO" | "IN-PROGRESS" | "COMPLETED"
                  )
                }
              >
                <option value="" hidden>
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
              {attachments.map((file, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {file.name}
                </p>
              ))}
            </div>
          </div>
          <div className="flex flex-row justify-end gap-2 mt-2">
            <button
              type="button"
              className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-pink-500 text-white rounded-full text-sm"
            >
              Create
            </button>
          </div>
        </form>
      </Modal>
      <button
        className="px-4 py-2 bg-purple-800 text-white rounded-full text-sm"
        onClick={() => setIsModalOpen(true)}
      >
        ADD TASK
      </button>
    </>
  );
}
