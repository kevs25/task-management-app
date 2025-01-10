export type TaskStatus = "TO-DO" | "IN-PROGRESS" | "COMPLETED";

export interface Task {
    id: string;
    title: string;
    dueDate: Date | null;
    status: TaskStatus
    category: string;
    description : string;
    attachments : File;
  }
  
  export interface TaskFormData {
    title: string;
    dueDate: Date | null;
    status: TaskStatus
    category: "WORK" | "PERSONAL";
    description : string;
    attachments : File | null;
  }