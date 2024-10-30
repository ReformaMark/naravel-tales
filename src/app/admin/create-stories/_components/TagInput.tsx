import { useState, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { Plus, X } from "lucide-react";

export const TagInput = ({ 
  initialTags,
  onTagsChange
}: {
  initialTags: string[];
  onTagsChange: (newTags: string[]) => void;
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>("");

  const handleAddTag = (e: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (inputValue && !tags.includes(inputValue)) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      onTagsChange(newTags); // Update parent component
      setInputValue("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    onTagsChange(newTags); // Update parent component
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className="border border-primary bg-primary/10 p-2 rounded space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="flex items-center bg-primary/20 px-2 py-1 rounded text-primary"
          >
            {tag}
            <X
              className="ml-1 cursor-pointer"
              size={14}
              onClick={() => handleRemoveTag(index)}
            />
          </div>
        ))}
      </div>
      <div className="relative flex items-center space-x-2 mt-2">
        <input
          id="tags"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag(e)}
          placeholder="Add a tag"
          className="border-primary bg-primary/50"
        />
        <button onClick={handleAddTag} className="p-1 rounded bg-primary text-white">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};
