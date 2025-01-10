import { useState } from "react";
import list_numbers from "../assets/list-numbers.svg";
import list_menu from "../assets/list-menu.svg";

interface TextEditorProps {
  value: string;
  onChangeText: (text: string) => void;
}

const TextEditor = ({value, onChangeText }: TextEditorProps) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeText(e.target.value);
  };  

  const styles = `w-full p-2 min-h-[100px] outline-none resize-none bg-[#f1f1f1] opacity-80
    ${isBold ? "font-bold" : ""}
    ${isItalic ? "italic" : ""}
    ${isUnderline ? "underline" : ""}`;

  return (
    <div className="border border-gray-300 rounded-md bg-[#f1f1f1]">
      <textarea
        value={value}
        onChange={handleTextChange}
        placeholder="Description"
        className={styles}
        maxLength={300}
        name="description"
      />
      <div className="flex flex-row justify-between items-center gap-4 p-2 border-b">
        <div className="flex items-center gap-4 p-2">
          <button
            type="button"
            className={`font-bold ${isBold ? "bg-gray-200" : ""}`}
            onClick={() => setIsBold(!isBold)}
          >
            B
          </button>
          <button
            type="button"
            className={`italic ${isItalic ? "bg-gray-200" : ""}`}
            onClick={() => setIsItalic(!isItalic)}
          >
            I
          </button>
          <button
            type="button"
            className={`underline ${isUnderline ? "bg-gray-200" : ""}`}
            onClick={() => setIsUnderline(!isUnderline)}
          >
            U
          </button>
          <button type="button">
            <img src={list_numbers} alt="Number List" className="w-4" />
          </button>
          <button type="button">
            <img src={list_menu} alt="Menu List" className="w-4" />
          </button>
        </div>
        <div className="text-right p-2 text-sm text-gray-500">
          {value.length}/300 characters
        </div>
      </div>
    </div>
  );
};

export default TextEditor;