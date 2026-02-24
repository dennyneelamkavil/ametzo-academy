"use client";

import { useState } from "react";
import Image from "next/image";

import AlertModal from "@/components/ui/alert/AlertModal";
import {
  ListActions,
  ListError,
  ListFilters,
  ListHeader,
} from "@/components/listing";
import { Select } from "@/components/form";
import Pagination from "@/components/pagination/Pagination";
import TableSkeleton from "@/components/skeletons/TableSkeleton";
import { SortableTableHeader } from "@/components/common/SortableTableHeader";

import { useAdminTable } from "@/hooks";

import type { Course } from "@/lib/types";
import { deleteAction, toggleAction } from "@/lib/actions";

type CourseSortKey = "title" | "createdAt" | "isPublished" | "price";

export default function CoursesListClient() {
  const [item, setItem] = useState<Course | null>(null);
  const [toggleItem, setToggleItem] = useState<Course | null>(null);
  const [isPublished, setIsPublished] = useState("");

  const {
    data: courses,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Course, CourseSortKey>({
    endpoint: "courses",
    storageKey: "table:courses",
    defaultSort: { key: "createdAt", direction: "desc" },
    extraParams: () => ({
      isPublished,
    }),
  });

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/courses/${item.id}`, {
      successMessage: "Course deleted successfully",
      errorMessage: "Failed to delete course",
    });

    if (success) refetch();
    setItem(null);
  }

  async function confirmToggleStatus() {
    if (!toggleItem) return;

    const success = await toggleAction(
      `/api/admin/courses/${toggleItem.id}`,
      { isPublished: !toggleItem.isPublished },
      {
        successMessage: "Course status updated",
        errorMessage: "Failed to update course status",
      },
    );

    if (success) refetch();
    setToggleItem(null);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Courses"
        actionLabel="Create Course"
        actionHref="/courses/create"
        createPermission="course:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setIsPublished("");
          setPage(1);
        }}
        disableClear={!search && !isPublished}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={[
              { value: "", label: "All" },
              { value: "true", label: "Published" },
              { value: "false", label: "Unpublished" },
            ]}
            value={isPublished}
            onChange={(v) => {
              setPage(1);
              setIsPublished(v);
            }}
          />
        </div>
      </ListFilters>

      <div className="rounded-lg border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CourseSortKey>
                    columnKey="title"
                    label="Title"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Image
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Level
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CourseSortKey>
                    columnKey="price"
                    label="Price"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CourseSortKey>
                    columnKey="isPublished"
                    label="Status"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<CourseSortKey>
                    columnKey="createdAt"
                    label="Created"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton columns={6} />
              ) : error ? (
                <ListError error={error} columns={6} />
              ) : courses.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No courses found
                  </td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {course.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {course.image && (
                        <Image
                          src={course.image.url}
                          alt={course.title}
                          width={50}
                          height={50}
                          className="rounded"
                        />
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {course.level}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      ₹{course.price}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {course.isPublished ? "Published" : "Draft"}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/courses/${course.id}`}
                        editHref={`/courses/${course.id}/edit`}
                        onDelete={() => setItem(course)}
                        onToggle={() => setToggleItem(course)}
                        isActive={course.isPublished}
                        editPermission="course:update"
                        deletePermission="course:delete"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-end p-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      <AlertModal
        isOpen={!!item}
        variant="danger"
        title={`Delete Course: ${item?.title}?`}
        message="If you just want to hide this course from students, consider unpublishing it instead."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
        secondaryText="Unpublish Instead"
        onSecondary={() => {
          setToggleItem(item);
          setItem(null);
        }}
      />

      <AlertModal
        isOpen={!!toggleItem}
        variant="warning"
        title={`${
          toggleItem?.isPublished ? "Unpublish" : "Publish"
        } Course: ${toggleItem?.title}?`}
        message={`This action will ${
          toggleItem?.isPublished ? "unpublish" : "publish"
        } this course.`}
        confirmText={toggleItem?.isPublished ? "Unpublish" : "Publish"}
        onClose={() => setToggleItem(null)}
        onConfirm={confirmToggleStatus}
      />
    </div>
  );
}
