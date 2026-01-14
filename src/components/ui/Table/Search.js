import React, { useState } from "react";
import Textinput from "../TextInput";
const TableSearchGlobal = ({ filter, setFilter }) => {
  const [value, setValue] = useState(filter);
  const onChange = (e) => {
    setValue(e.target.value);
    setFilter(e.target.value || undefined);
  };
  return (
    <div>
      <Textinput
        value={value || ""}
        onChange={onChange}
        placeholder="search..."
      />
    </div>
  );
};

export default TableSearchGlobal;
