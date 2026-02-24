"use client";

import { useEffect, useState } from "react";

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

import type { Lesson, CourseBase } from "@/lib/types";
import { deleteAction } from "@/lib/actions";

type LessonSortKey = "title" | "order" | "createdAt";

export default function LessonsListClient() {
  const [item, setItem] = useState<Lesson | null>(null);
  const [courseFilter, setCourseFilter] = useState("");
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    data: lessons,
    loading,
    error,
    pagination,
    setPage,
    search,
    setSearch,
    sortState,
    onSortChange,
    refetch,
  } = useAdminTable<Lesson, LessonSortKey>({
    endpoint: "lessons",
    storageKey: "table:lessons",
    defaultSort: { key: "order", direction: "asc" },
    extraParams: () => ({
      course: courseFilter,
    }),
  });

  useEffect(() => {
    async function loadCourses() {
      const res = await fetch("/api/admin/courses?all=true");
      const data = await res.json();

      const options = data.data.map((c: CourseBase) => ({
        value: c.id,
        label: c.title,
      }));

      setCourseOptions(options);
    }

    loadCourses();
  }, []);

  async function confirmDelete() {
    if (!item) return;

    const success = await deleteAction(`/api/admin/lessons/${item.id}`, {
      successMessage: "Lesson deleted successfully",
      errorMessage: "Failed to delete lesson",
    });

    if (success) refetch();
    setItem(null);
  }

  return (
    <div className="space-y-6">
      <ListHeader
        title="Lessons"
        actionLabel="Create Lesson"
        actionHref="/lessons/create"
        createPermission="lesson:create"
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => {
          setPage(1);
          setSearch(v);
        }}
        onClear={() => {
          setSearch("");
          setCourseFilter("");
          setPage(1);
        }}
        disableClear={!search && !courseFilter}
      >
        <div className="w-full sm:max-w-xs">
          <Select
            options={[{ value: "", label: "All Courses" }, ...courseOptions]}
            value={courseFilter}
            onChange={(v) => {
              setPage(1);
              setCourseFilter(v);
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
                  <SortableTableHeader<LessonSortKey>
                    columnKey="title"
                    label="Title"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Course
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<LessonSortKey>
                    columnKey="order"
                    label="Order"
                    activeKey={sortState.key}
                    direction={sortState.direction}
                    onSort={onSortChange}
                  />
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  Duration
                </th>
                <th className="px-5 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                  <SortableTableHeader<LessonSortKey>
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
                <TableSkeleton columns={5} />
              ) : error ? (
                <ListError error={error} columns={5} />
              ) : lessons.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-gray-800 dark:text-white/90"
                  >
                    No lessons found
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr
                    key={lesson.id}
                    className="border-b border-gray-200 dark:border-gray-800"
                  >
                    <td className="px-5 py-4 font-mono text-sm text-gray-800 dark:text-white/90">
                      {lesson.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {typeof lesson.course === "object"
                        ? lesson.course.title
                        : lesson.course}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {lesson.order}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {lesson.durationMinutes} min
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-800 dark:text-white/90">
                      {new Date(lesson.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <ListActions
                        viewHref={`/lessons/${lesson.id}`}
                        editHref={`/lessons/${lesson.id}/edit`}
                        onDelete={() => setItem(lesson)}
                        editPermission="lesson:update"
                        deletePermission="lesson:delete"
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
        title={`Delete Lesson: ${item?.title}?`}
        message="This remove the lesson permanently."
        confirmText="Delete"
        onClose={() => setItem(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
