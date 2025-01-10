import { useState } from "react";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

interface DropdownProps {
  onEdit: (event: React.MouseEvent) => void; // Pass MouseEvent to handle event control
  onDelete: (event: React.MouseEvent) => void; // Pass MouseEvent
}


export const TaskDropdown = ({ onEdit, onDelete }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="p-1 hover:bg-gray-100 rounded-full"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 py-1 min-w-[120px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(e);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};