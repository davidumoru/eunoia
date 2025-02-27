"use client";

import { updateEntry } from "@/utils/api";
import { useState } from "react";
import { useAutosave } from "react-autosave";

interface Entry {
  id: string;
  content: string;
}

const Editor = ({ entry }: { entry: Entry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const updated = await updateEntry(entry.id, _value);
      setIsLoading(false);
    },
  });
  return (
    <div className="w-full h-full">
      {isLoading && <div>...loading</div>}
      <textarea
        className="w-full h-full p-8 text-xl outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></textarea>
    </div>
  );
};

export default Editor;
