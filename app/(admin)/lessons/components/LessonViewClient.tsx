"use client";

import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { ViewActions, ViewField, ViewSection } from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Lesson } from "@/lib/types";

type Props = {
  id: string;
};

export default function LessonViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: lesson,
    loading,
    error,
  } = useAdminEntity<Lesson>({
    endpoint: "lessons",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Lesson" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !lesson ? null : (
          <div className="space-y-6">
            {/* Sticky Overview */}
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ViewField label="Title" value={lesson.title} mono />

                <ViewField
                  label="Course"
                  value={
                    typeof lesson.course === "object"
                      ? lesson.course.title
                      : lesson.course
                  }
                />

                <ViewField label="Order" value={lesson.order ?? 0} />

                <ViewField
                  label="Duration (Minutes)"
                  value={lesson.durationMinutes ?? 0}
                />
              </div>
            </div>

            {/* Video Section */}
            {lesson.videoUrl && (
              <ViewSection>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Lesson Video</p>

                  <video
                    src={lesson.videoUrl.url}
                    controls
                    className="w-full max-w-3xl rounded-lg border dark:border-gray-800"
                  />

                  {lesson.videoUrl.caption && (
                    <p className="text-sm text-gray-500">
                      {lesson.videoUrl.caption}
                    </p>
                  )}
                </div>
              </ViewSection>
            )}

            {/* Meta */}
            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(lesson.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(lesson.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            {/* Actions */}
            <ViewActions
              primaryLabel="Edit Lesson"
              primaryPermission="lesson:update"
              onPrimary={() => router.push(`/lessons/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
