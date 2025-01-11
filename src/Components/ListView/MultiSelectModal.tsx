//this file contains to file status updation Modal for the selected task and multiselect modal component which allows user to select multiple task in a section either to update status or delete task.
import { useState } from "react";
import Modal from "react-modal"; // Import react-modal
import close_icon from "../../assets/close_icon.svg";
import task_icon from "../../assets/tasks_icon.svg";

interface MultiSelectProps {
  selectedCount: number;
  onClose: () => void;
  onDelete: () => void;
  onStatusChange: (status: string) => void;
}

const StatusModal = ({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (status: string) => void;
}) => {
  const statusOptions = [
    { id: "TO-DO", label: "TO-DO" },
    { id: "IN-PROGRESS", label: "IN-PROGRESS" },
    { id: "COMPLETED", label: "COMPLETED" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-transparent" 
      className="absolute bg-black rounded-lg w-40 z-20 shadow-lg"
      style={{
        content: {
          top: "calc(72% - 80px)", 
          left: "50%",
          transform: "translateX(-50%)", 
          padding: "0.5rem",
        },
        overlay: {
          backgroundColor: "transparent",
        },
      }}
    >
      <div className="p-2 space-y-2">
        {statusOptions.map((option) => (
          <button
            key={option.id}
            className="w-full text-center py-2 text-white hover:bg-gray-700 rounded transition-colors"
            onClick={() => onSelect(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </Modal>
  );
};

const MultiSelectModal = ({
  selectedCount,
  onClose,
  onDelete,
  onStatusChange,
}: MultiSelectProps) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  return (
    <Modal
      isOpen={true} 
      onRequestClose={onClose}
      ariaHideApp={false}
      overlayClassName="fixed inset-0 bg-black bg-opacity-5 flex justify-center items-end"
      className="relative bg-black p-4 rounded-xl w-full max-w-md mb-4 mx-4 overflow-hidden z-10"
    >
      <div className="flex flex-row gap-2 justify-between items-center w-full">
        <div className="flex flex-row gap-2 items-center">
          <img src={task_icon} alt="tasks" className="w-5" />
          <p className="text-white text-sm">{selectedCount} Tasks Selected</p>
        </div>
        <button onClick={onClose}>
          <img src={close_icon} alt="close" className="w-5" />
        </button>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="text-white text-sm rounded-xl border-[1px] p-1 w-20 bg-gray-800"
          onClick={() => setIsStatusModalOpen(true)}
        >
          Status
        </button>
        <button
          className="text-red-700 text-sm rounded-xl border-[1px] p-1 w-20 bg-red-950"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>

      {/* Status Modal */}
      <StatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSelect={(status) => {
          onStatusChange(status);
          setIsStatusModalOpen(false); 
        }}
      />
    </Modal>
  );
};

export default MultiSelectModal;
