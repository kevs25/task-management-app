export type TaskStatus = "TO-DO" | "IN-PROGRESS" | "COMPLETED";

export interface Task {
  id: string;
  title: string;
  dueDate: Date | string | null;
  status: TaskStatus | string;
  category: string;
  description: string;
  attachments: File | string;
  updatedAt: Date;
  activityLog: ActivityLog[];
}

export interface TaskFormData {
  title: string;
  dueDate: Date | null;
  status: TaskStatus
  category: "WORK" | "PERSONAL";
  description: string;
  attachments: File | null;
}

export interface ActivityLog {
  action: string;
  timestamp: string;
  details: string; // Optional: more details about the action
}