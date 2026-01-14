"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const QuillEditor = forwardRef(({ value, onChange }, ref) => {
  // const imageHandler = function () {
  //   const range = this.quill.getSelection();
  //   const url = prompt("Masukkan URL gambar:");
  //   if (url) {
  //     this.quill.insertEmbed(range.index, "image", url, "user");
  //   }
  // };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <ReactQuill
      ref={ref}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
    />
  );
});

QuillEditor.displayName = "QuillEditor";
export default QuillEditor;
