"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/TextInput";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import CheckInput from "@/components/ui/CheckInput";
import Textinput from "@/components/ui/TextInput";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";

const questionSchema = yup.object().shape({
  text: yup.string().required("Question text is required"),
  category: yup.string().required("Category is required"),
  spm_criteria: yup.string().required("SPM Criteria is required"),
  spm_reference: yup.string().nullable(),
  order: yup
    .number()
    .typeError("Order must be a number")
    .min(1, "Order must be at least 1")
    .required("Order is required"),
});

const questionSetSchema = yup.object().shape({
  description: yup.string().required("Description is required"),
  service_types: yup
    .array()
    .min(1, "At least one service type is required")
    .required("Service type is required"),
  fleet_types: yup
    .array()
    .min(1, "At least one fleet type is required")
    .required("Fleet type is required"),
});

const QuestionDetails = ({ initialData }) => {
  const router = useRouter();
  const [questionSet, setQuestionSet] = useState(initialData);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [isEditSetModalOpen, setIsEditSetModalOpen] = useState(false);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [fleetTypes, setFleetTypes] = useState([]);

  const {
    register: registerQuestion,
    handleSubmit: handleAddQuestionSubmit,
    control: controlQuestion,
    reset: resetQuestionForm,
    formState: { errors: questionErrors },
  } = useForm({
    resolver: yupResolver(questionSchema),
    defaultValues: {
      order: questionSet.questions.length > 0 ? Math.max(...questionSet.questions.map(q => q.order)) + 1 : 1
    }
  });

  const {
    register: registerSet,
    handleSubmit: handleEditSetSubmit,
    control: controlSet,
    reset: resetSetForm,
    formState: { errors: setErrors },
  } = useForm({
    resolver: yupResolver(questionSetSchema),
    defaultValues: {
      description: questionSet.description,
      service_types: questionSet.service_types.map(st => st.id.toString()), // Map to array of string IDs
      fleet_types: questionSet.fleet_types.map(ft => ft.id.toString()),     // Map to array of string IDs
    }
  });

  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const [serviceRes, fleetRes] = await Promise.all([
          axios.get("/api/services/service-types"),
          axios.get("/api/services/fleet-types"),
        ]);
        setServiceTypes(serviceRes.data); // Keep as full objects for checkboxes
        setFleetTypes(fleetRes.data);     // Keep as full objects for checkboxes
      } catch (error) {
        console.error("Failed to fetch select options:", error);
        toast.error("Failed to load necessary data.");
      }
    };
    fetchSelectOptions();
  }, []);

  const questionColumns = useMemo(
    () => [
      {
        header: "Order",
        accessorKey: "order",
      },
      {
        header: "Category",
        accessorKey: "category",
      },
      {
        header: "Question Text",
        accessorKey: "text",
      },
      {
        header: "SPM Criteria",
        accessorKey: "spm_criteria",
      },
      {
        header: "SPM Reference",
        accessorKey: "spm_reference",
      },
      {
        header: "Actions",
        accessorKey: "id",
        cell: (info) => (
          <div className="flex space-x-3 rtl:space-x-reverse">
            {/* Edit and Delete actions for individual questions */}
            <Button
              icon="heroicons:pencil-square"
              className="btn-link btn-sm p-0"
              onClick={() => toast.info("Edit question functionality coming soon!")}
            />
            <Button
              icon="heroicons:trash"
              className="btn-link btn-sm p-0 text-danger-500"
              onClick={() => toast.info("Delete question functionality coming soon!")}
            />
          </div>
        ),
      },
    ],
    []
  );

  const questionTable = useReactTable({
    data: questionSet.questions,
    columns: questionColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const onAddQuestionSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        order: Number(formData.order), // Ensure order is a number
      };

      await axios.post(
        `/api/armada/question-set/${questionSet.id}/questions`,
        payload
      );
      toast.success("Question added successfully!");
      router.refresh(); // Revalidate data
      setIsAddQuestionModalOpen(false);
      resetQuestionForm({
        order: Math.max(...questionSet.questions.map(q => q.order)) + 1,
        text: "",
        category: "",
        spm_criteria: "",
        spm_reference: ""
      });
    } catch (error) {
      console.error("Failed to add question:", error);
      toast.error(error.response?.data?.error || "Failed to add question");
    }
  };

  const onEditSetSubmit = async (formData) => {
    try {
      const payload = {
        description: formData.description,
        service_types: formData.service_types.map((st) => st.value),
        fleet_types: formData.fleet_types.map((ft) => ft.value),
      };

      await axios.put(`/api/armada/question-set/${questionSet.id}`, payload);
      toast.success("Question Set updated successfully!");
      router.refresh();
      setIsEditSetModalOpen(false);
    } catch (error) {
      console.error("Failed to update question set:", error);
      toast.error(
        error.response?.data?.error || "Failed to update question set"
      );
    }
  };

  const onDeleteSet = async () => {
    if (window.confirm("Are you sure you want to delete this question set? All associated questions will also be deleted.")) {
      try {
        await axios.delete(`/api/armada/question-set/${questionSet.id}`);
        toast.success("Question Set deleted successfully!");
        router.push("/admin/armada/question-set"); // Redirect after deletion
      } catch (error) {
        console.error("Failed to delete question set:", error);
        toast.error(
          error.response?.data?.error || "Failed to delete question set"
        );
      }
    }
  };

  return (
    <div>
      <Card title="Question Set Details">
        <div className="space-y-4">
          <div>
            <span className="font-semibold">Description: </span>
            <span>{questionSet.description}</span>
          </div>
          <div>
            <span className="font-semibold">Service Types: </span>
            <span>
              {questionSet.service_types.map((st) => st.name).join(", ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Fleet Types: </span>
            <span>
              {questionSet.fleet_types.map((ft) => ft.name).join(", ")}
            </span>
          </div>
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Button
              text="Edit Question Set"
              className="btn-outline-primary btn-sm"
              onClick={() => {
                resetSetForm({
                  description: questionSet.description,
                  service_types: questionSet.service_types.map(st => st.id.toString()), // Map to array of string IDs
                  fleet_types: questionSet.fleet_types.map(ft => ft.id.toString()),     // Map to array of string IDs
                });
                setIsEditSetModalOpen(true);
              }}
            />
            <Button
              text="Delete Question Set"
              className="btn-danger btn-sm"
              onClick={onDeleteSet}
            />
          </div>
        </div>
      </Card>

      <Card title="Questions in this Set" className="mt-6">
        <div className="mb-4 flex justify-end">
          <Button
            text="Add New Question"
            className="btn-primary"
            onClick={() => {
              resetQuestionForm({
                order: questionSet.questions.length > 0 ? Math.max(...questionSet.questions.map(q => q.order)) + 1 : 1,
                text: "",
                category: "",
                spm_criteria: "",
                spm_reference: ""
              });
              setIsAddQuestionModalOpen(true);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="table-bordered table-hover table-auto w-full">
            <thead>
              {questionTable.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} scope="col">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {questionTable.getRowModel().rows.length ? (
                questionTable.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={questionColumns.length} className="text-center">
                    No questions found in this set.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination flex justify-center mt-4">
          <Button
            onClick={() => questionTable.previousPage()}
            disabled={!questionTable.getCanPreviousPage()}
            text="Previous"
            className="btn-outline-secondary btn-sm mr-2"
          />
          <Button
            onClick={() => questionTable.nextPage()}
            disabled={!questionTable.getCanNextPage()}
            text="Next"
            className="btn-outline-secondary btn-sm"
          />
        </div>
      </Card>

      {/* Add Question Modal */}
      <Modal
        activeModal={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        title="Add New Question"
      >
        <form onSubmit={handleAddQuestionSubmit(onAddQuestionSubmit)} className="space-y-4">
          <TextInput
            label="Order"
            type="number"
            placeholder="Enter order number"
            register={registerQuestion("order")}
            error={questionErrors.order}
          />
          <TextArea
            label="Question Text"
            placeholder="Enter question text"
            register={registerQuestion("text")}
            error={questionErrors.text}
          />
          <TextInput
            label="Category"
            type="text"
            placeholder="Enter category"
            register={registerQuestion("category")}
            error={questionErrors.category}
          />
          <TextArea
            label="SPM Criteria"
            placeholder="Enter SPM criteria"
            register={registerQuestion("spm_criteria")}
            error={questionErrors.spm_criteria}
          />
          <TextInput
            label="SPM Reference"
            type="text"
            placeholder="Enter SPM reference (optional)"
            register={registerQuestion("spm_reference")}
            error={questionErrors.spm_reference}
          />
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              type="button"
              text="Cancel"
              className="btn-outline-secondary"
              onClick={() => setIsAddQuestionModalOpen(false)}
            />
            <Button type="submit" text="Add Question" className="btn-primary" />
          </div>
        </form>
      </Modal>

      {/* Edit Question Set Modal */}
      <Modal
        activeModal={isEditSetModalOpen}
        onClose={() => setIsEditSetModalOpen(false)}
        title="Edit Question Set"
      >
        <form onSubmit={handleEditSetSubmit(onEditSetSubmit)} className="space-y-4">
          <TextInput
            label="Description"
            type="text"
            placeholder="Enter description"
            register={registerSet("description")}
            error={setErrors.description}
          />
          <div>
            <label className="form-label mb-1 block capitalize">
              Service Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {serviceTypes.map((st) => (
                <Controller
                  key={st.id}
                  name="service_types"
                  control={controlSet}
                  render={({ field }) => (
                    <CheckInput
                      label={st.name}
                      value={st.id.toString()}
                      checked={field.value.includes(st.id.toString())}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          field.onChange([...field.value, value]);
                        } else {
                          field.onChange(
                            field.value.filter((item) => item !== value)
                          );
                        }
                      }}
                    />
                  )}
                />
              ))}
            </div>
            {setErrors.service_types && (
              <span className="text-danger-500 text-sm">
                {setErrors.service_types.message}
              </span>
            )}
          </div>

          <div>
            <label className="form-label mb-1 block capitalize">
              Fleet Types
            </label>
            <div className="grid grid-cols-2 gap-2">
              {fleetTypes.map((ft) => (
                <Controller
                  key={ft.id}
                  name="fleet_types"
                  control={controlSet}
                  render={({ field }) => (
                    <CheckInput
                      label={ft.name}
                      value={ft.id.toString()}
                      checked={field.value.includes(ft.id.toString())}
                      onChange={(e) => {
                        const value = e.target.value;
                        const isChecked = e.target.checked;
                        if (isChecked) {
                          field.onChange([...field.value, value]);
                        } else {
                          field.onChange(
                            field.value.filter((item) => item !== value)
                          );
                        }
                      }}
                    />
                  )}
                />
              ))}
            </div>
            {setErrors.fleet_types && (
              <span className="text-danger-500 text-sm">
                {setErrors.fleet_types.message}
              </span>
            )}
          </div>
          <div className="flex justify-end space-x-3 rtl:space-x-reverse">
            <Button
              type="button"
              text="Cancel"
              className="btn-outline-secondary"
              onClick={() => setIsEditSetModalOpen(false)}
            />
            <Button type="submit" text="Update Set" className="btn-primary" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionDetails;
