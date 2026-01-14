"use client";

import React from "react";
import Icon from "../Icon";
import Button from "../Button";
import exportFromJSON from "export-from-json";

const ButtonExport = ({ data, fileName = "Data", className }) => {
  const handleExport = () => {
    const exportType = exportFromJSON.types["xls"];
    exportFromJSON({ data, fileName, exportType, delimiter: ";" });
  };
  return (
    <Button
      onClick={handleExport}
      className={className ? className : "btn-outline-dark btn-sm px-8 py-0"}
    >
      <Icon icon="solar:export-bold" width="16" height="16" className="mr-1" />
      Ekspor
    </Button>
  );
};

export default ButtonExport;
