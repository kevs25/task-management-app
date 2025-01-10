import { useState } from "react";
import { Plus, Calendar } from "lucide-react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../FireBaseConfig";
import { TaskFormData } from "../../Types/task";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { useUser } from "../../hooks/useUser";

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm = ({ onClose }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    dueDate: null,
    status: "TO-DO",
    category: "WORK",
    description: "",
    attachments: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const { user } =useUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        await addDoc(collection(db, "users", user.uid, "tasks"), {
          ...formData,
          dueDate: formData.dueDate ? format(formData.dueDate, "MMM dd, yyyy") : null,
          createdAt: format(new Date(), "MMM dd, yyyy"),
          userId: user.uid,  // Add user ID
          userDisplayName: user.displayName,  // Add user display name
        });
        onClose();
      } else {
        console.error("No user found");
      }
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      dueDate: date, // Update the state with the selected date
    }));
  };

  return (
    <div className="mb-4 bg-gray-100 p-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row gap-36">
          <div className="flex flex-col">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Task Title"
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-36">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </div>
              <DatePicker
                selected={formData.dueDate}
                onChange={handleDateChange}
                className="w-full md:w-40 rounded-md border border-gray-200 px-3 py-1.5 text-gray-700"
                placeholderText="DD/MM/YYYY"
                dateFormat="dd, MMM yyyy"
              />
            </div>

            <div className="flex-1">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="WORK">WORK</option>
              <option value="PERSONAL">PERSONAL</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center"
          >
            ADD <Plus size={16} className="ml-1" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
