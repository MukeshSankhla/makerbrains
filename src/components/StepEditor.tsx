
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

type Step = {
  title: string;
  content: string;
};

interface StepEditorProps {
  step: Step;
  index: number;
  onChange: (index: number, updatedStep: Step) => void;
  onRemove: (index: number) => void;
  showRemove: boolean;
}

const StepEditor: React.FC<StepEditorProps> = ({
  step,
  index,
  onChange,
  onRemove,
  showRemove,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded p-4 mb-4 border shadow-sm">
      <div className="mb-2 flex items-center gap-4">
        <input
          className="w-full px-3 py-2 border rounded bg-background text-base font-medium"
          type="text"
          placeholder={`Step ${index + 1} title`}
          value={step.title}
          onChange={e => onChange(index, { ...step, title: e.target.value })}
          required
        />
        {showRemove && (
          <button
            type="button"
            className="text-destructive font-bold px-2 hover:underline"
            onClick={() => onRemove(index)}
            aria-label={`Remove Step ${index + 1}`}
          >
            ✕
          </button>
        )}
      </div>
      <ReactQuill
        theme="snow"
        value={step.content}
        onChange={content => onChange(index, { ...step, content })}
        className="mb-2"
        placeholder="Write step details here with formatting, images, etc."
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        }}
      />
    </div>
  );
};

export default StepEditor;
