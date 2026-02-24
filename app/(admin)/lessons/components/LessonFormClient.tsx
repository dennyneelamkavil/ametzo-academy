"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  FileInput,
  Select,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import type { Media, CourseBase } from "@/lib/types";

type Fields = "title" | "course" | "videoUrl";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function LessonFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [courseOptions, setCourseOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [videoUrl, setVideoUrl] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);

  const [durationMinutes, setDurationMinutes] = useState("");
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  /* ================= LOAD COURSES ================= */

  useEffect(() => {
    async function loadCourses() {
      try {
        const res = await fetch("/api/admin/courses?all=true");
        const data = await res.json();

        const options = data.data.map((c: CourseBase) => ({
          value: c.id,
          label: c.title,
        }));

        setCourseOptions(options);
      } catch {
        setCourseOptions([]);
      }
    }

    loadCourses();
  }, []);

  /* ================= LOAD LESSON ================= */

  const fetchLesson = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/lessons/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load lesson");

      const data = await res.json();

      setTitle(data.title);
      setCourse(data.course);
      setVideoUrl(data.videoUrl ?? null);
      setDurationMinutes(String(data.durationMinutes ?? ""));
      setOrder(String(data.order ?? ""));
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchLesson();
  }, [mode, fetchLesson]);

  /* ================= SUBMIT ================= */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError(null);
    clearAllFieldErrors();

    let hasError = false;

    if (!title) {
      setFieldError("title", "Title is required");
      hasError = true;
    }

    if (!course) {
      setFieldError("course", "Course is required");
      hasError = true;
    }

    if (!videoUrl) {
      setFieldError("videoUrl", "Video is required");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/lessons" : `/api/admin/lessons/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            course,
            videoUrl,
            durationMinutes: durationMinutes
              ? Number(durationMinutes)
              : undefined,
            order: order ? Number(order) : undefined,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/lessons" : `/lessons/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  return (
    <div className="space-y-6">
      <FormHeader title={mode === "create" ? "Create Lesson" : "Edit Lesson"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Lesson Title" required htmlFor="title">
                <Input
                  id="title"
                  placeholder="Enter lesson title"
                  value={title}
                  onChange={(e) => {
                    clearFieldError("title");
                    setError(null);
                    setTitle(e.target.value);
                  }}
                  error={!!fieldErrors.title}
                  hint={fieldErrors.title}
                  autoFocus
                />
              </FormField>

              <FormField label="Course" required>
                <Select
                  options={courseOptions}
                  value={course}
                  placeholder="Select course"
                  onChange={(value) => {
                    clearFieldError("course");
                    setError(null);
                    setCourse(value);
                  }}
                  error={!!fieldErrors.course}
                  hint={fieldErrors.course}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Lesson Video" required htmlFor="videoUrl">
                  <FileInput
                    accept="video/*"
                    error={!!fieldErrors.videoUrl}
                    hint={fieldErrors.videoUrl}
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        setUploading(true);
                        clearFieldError("videoUrl");
                        setError(null);
                        const media = await uploadMedia(file, "temp/lessons");
                        setVideoUrl(media);
                      } catch (err: any) {
                        setFieldError(
                          "videoUrl",
                          err.message ?? "Upload failed",
                        );
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading image...</p>
                  )}
                </FormField>

                {videoUrl && (
                  <video
                    src={videoUrl.url}
                    controls
                    className="w-[120px] rounded"
                  />
                )}
              </div>

              {videoUrl && (
                <div className="space-y-4">
                  <FormField label="Image Alt Text">
                    <Input
                      placeholder="e.g. category image"
                      value={videoUrl.alt ?? ""}
                      onChange={(e) =>
                        setVideoUrl((prev) =>
                          prev ? { ...prev, alt: e.target.value } : prev,
                        )
                      }
                      hint="Describe the video for SEO & accessibility"
                    />
                  </FormField>

                  <FormField label="Video Caption (optional)">
                    <Input
                      placeholder="Optional caption shown below the video"
                      value={videoUrl.caption ?? ""}
                      onChange={(e) =>
                        setVideoUrl((prev) =>
                          prev ? { ...prev, caption: e.target.value } : prev,
                        )
                      }
                    />
                  </FormField>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Duration (Minutes)">
                <Input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                />
              </FormField>

              <FormField label="Order">
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                />
              </FormField>
            </div>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Lesson"
                    : "Update Lesson"
              }
              primaryDisabled={saving || uploading || hasErrors}
              backLabel="Cancel"
              onBack={() => router.back()}
            />
          </form>
        )}
      </div>
    </div>
  );
}
