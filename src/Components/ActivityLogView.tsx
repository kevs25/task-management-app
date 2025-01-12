import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useUser } from "../hooks/useUser";
import { ActivityLog, Task } from "../Types/task";
import { db } from "../FireBaseConfig";
import formatDate from "../Utils/DateFormat";

interface ActivityLogViewProps {
  task: Task;
}

export default function ActivityLogView({ task }: ActivityLogViewProps) {
  const { user } = useUser();
  const [ActivityLogData, setActivitLogData] = useState<ActivityLog[] | null>(
    null
  );
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const fetchTaskData = async () => {
      if (!user?.uid) return;

      const taskRef = doc(db, "users", user.uid, "tasks", task?.id);
      try {
        const taskSnapshot = await getDoc(taskRef); // Await the asynchronous call
        if (taskSnapshot.exists()) {
          const taskData = taskSnapshot.data();
          console.log("Activity Log:", taskData?.activityLog); // Safely access activityLog
          setActivitLogData(taskData?.activityLog);
          setCreatedAt(taskData?.createdAt);
        } else {
          console.log("No such task!");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTaskData();
  }, [user?.uid, task?.id]);

  return (
    <div className="flex flex-col gap-3 w-full max-md:h-[70vh] p-4">
      <p className="hidden md:inline-block">ActivityLog</p>
      <div className="bg-[#f1f1f1] text-sm p-4 max-md:bg-white">
        <div className="flex flex-row justify-between">You created this task at <span className="text-gray-400">{createdAt}</span></div>
        {ActivityLogData?.map((items, index) => (
          <div className="flex flex-row justify-between py-4" key={index}>
            <p className="text-gray-800">{items.details}</p>
            <p className="text-gray-400">{items.timestamp  && formatDate(items.timestamp)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
