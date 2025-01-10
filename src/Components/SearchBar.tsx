import search_icon from '../assets/search_icon.svg'
interface SearchBarProps {
  onSearch: (query: string) => void; 
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value); // Pass the query to the parent component
  };

  return (
    <div className="relative max-md:mt-2 max-md:w-full">
      <input
        type="text"
        placeholder="Search"
        className="p-2 pl-10 border rounded-full w-full outline-none"
        onChange={handleInputChange}
      />
      <img
        src={search_icon}
        alt="Search Icon"
        className="absolute left-3 top-1/2 -translate-y-2/4 w-5 h-5 text-gray-500 max-md:top-1/2"
      />
    </div>
  );
}
