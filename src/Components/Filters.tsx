// This file handles filtering of tasks by category and due date
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import chevronDown from "../assets/chevron-down.svg";
import AddTask from "./AddTask";
interface FilterProps {
  onSelect: (categoryQuery: string) => void;
  onDateRangeSelect: (startDate: Date | null, endDate: Date | null) => void;
}

export default function Filters({ onSelect, onDateRangeSelect }: FilterProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    onSelect(value); 
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onDateRangeSelect(start, end); 
  };

  return (
    <div className="gap-4 md:flex items-baseline max-md:flex-col max-md:w-full">
      <div className="max-md:flex justify-end items-center w-full md:hidden">
        <div className="flex flex-row justify-between">
          <AddTask />
        </div>
      </div>
      <span className="text-gray-700">Filter by:</span>
      <div className="flex max-md:flex-row gap-2">
        <select
          className="p-2 border rounded-full cursor-pointer opacity-45 h-10"
          onChange={handleCategoryChange}
        >
          <option value="" hidden>
            Category
          </option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={handleDateRangeChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            dateFormat="dd/MM/yyyy"
            placeholderText="Due Date"
            className="p-2 border rounded-full cursor-pointer h-10 text-md opacity-80 w-36"
          />

          <img
            className="absolute left-28 top-2/4 -translate-y-2/4 pointer-events-none opacity-45 size-6 md:right-1"
            src={chevronDown}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}
