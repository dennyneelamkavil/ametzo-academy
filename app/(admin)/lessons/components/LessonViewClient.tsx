"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { ViewActions, ViewField, ViewSection } from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Lesson } from "@/lib/types";
import MediaPreviewModal from "@/components/ui/media/MediaPreviewModal";

type Props = {
  id: string;
};

export default function LessonViewClient({ id }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-3 space-y-3">
                    <video
                      src={lesson.videoUrl.url}
                      controls
                      className="w-full rounded"
                    />

                    {/* Metadata */}
                    {(lesson.videoUrl.alt || lesson.videoUrl.caption) && (
                      <div className="space-y-1">
                        {lesson.videoUrl.alt && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Alt:</span>{" "}
                            {lesson.videoUrl.alt}
                          </p>
                        )}
                        {lesson.videoUrl.caption && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Caption:</span>{" "}
                            {lesson.videoUrl.caption}
                          </p>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setPreview(lesson.videoUrl.url)}
                      className="rounded border px-3 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      ▶ Preview Video
                    </button>
                  </div>
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

      <MediaPreviewModal
        isOpen={!!preview}
        onClose={() => setPreview(null)}
        type={"video"}
        src={preview ?? ""}
      />
    </div>
  );
}
