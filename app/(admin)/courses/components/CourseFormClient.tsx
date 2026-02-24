"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Authorized } from "@/components/auth/Authorized";

import {
  FormHeader,
  FormField,
  FormError,
  FormActions,
  Input,
  TextArea,
  FileInput,
  Switch,
  Select,
  FormSEOSection,
} from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import { useFieldErrors, useScrollToTop } from "@/hooks";

import { uploadMedia } from "@/lib/uploadMedia";
import { formatSlug } from "@/lib/utils";

import type { Media, Seo, CategoryBase } from "@/lib/types";

type Fields =
  | "title"
  | "slug"
  | "category"
  | "image"
  | "price"
  | "durationHours";

type Props = {
  mode: "create" | "edit";
  id?: string;
};

export default function CourseFormClient({ mode, id }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");

  const [category, setCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [level, setLevel] = useState("Beginner");
  const [durationHours, setDurationHours] = useState("");
  const [price, setPrice] = useState("");

  const [image, setImage] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);

  const [seo, setSeo] = useState<Seo>({});
  const [uploadingSeoImg, setUploadingSeoImg] = useState(false);

  const [isPublished, setIsPublished] = useState(false);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { fieldErrors, setFieldError, clearFieldError, clearAllFieldErrors } =
    useFieldErrors<Fields>();

  useScrollToTop(error || fieldErrors);

  /* ================= LOAD CATEGORIES ================= */

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories?all=true");
        const data = await res.json();

        const options = data.data.map((cat: CategoryBase) => ({
          value: cat.id,
          label: cat.name,
        }));

        setCategoryOptions(options);
      } catch {
        setCategoryOptions([]);
      }
    }

    loadCategories();
  }, []);

  /* ================= LOAD COURSE ================= */

  const fetchCourse = useCallback(async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed to load course");

      const data = await res.json();

      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description ?? "");
      setCategory(data.category);
      setLevel(data.level ?? "Beginner");
      setDurationHours(String(data.durationHours ?? ""));
      setPrice(String(data.price ?? ""));
      setImage(data.image ?? null);
      setSeo(data.seo ?? {});
      setIsPublished(data.isPublished);
    } catch (err: any) {
      setEditError(err.message ?? "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (mode === "edit") fetchCourse();
  }, [mode, fetchCourse]);

  /* ================= HANDLERS ================= */

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(formatSlug(e.target.value));
  };

  async function handleUploadOgImage(file: File) {
    setUploadingSeoImg(true);
    try {
      return await uploadMedia(file, "temp/seo");
    } finally {
      setUploadingSeoImg(false);
    }
  }

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

    if (!category) {
      setFieldError("category", "Category is required");
      hasError = true;
    }

    if (!image) {
      setFieldError("image", "Image is required");
      hasError = true;
    }

    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(
        mode === "create" ? "/api/admin/courses" : `/api/admin/courses/${id}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            slug,
            description,
            category,
            level,
            durationHours: durationHours ? Number(durationHours) : undefined,
            price: price ? Number(price) : 0,
            image,
            seo,
            isPublished,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error ?? "Save failed");
      }

      router.push(mode === "create" ? "/courses" : `/courses/${id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const hasErrors = Object.values(fieldErrors).some(Boolean) || !!error;

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6">
      <FormHeader title={mode === "create" ? "Create Course" : "Edit Course"} />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : editError ? (
          <FormError error={editError} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && <FormError error={error} />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Course Title" required htmlFor="title">
                <Input
                  id="title"
                  placeholder="Course Title"
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

              {mode === "edit" && (
                <FormField label="Slug" required htmlFor="slug">
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => {
                      clearFieldError("slug");
                      setError(null);
                      handleSlugChange(e);
                    }}
                    error={!!fieldErrors.slug}
                    hint={fieldErrors.slug}
                  />
                </FormField>
              )}

              <FormField label="Category" required>
                <Select
                  options={categoryOptions}
                  value={category}
                  placeholder="Select category"
                  onChange={(value) => {
                    clearFieldError("category");
                    setError(null);
                    setCategory(value);
                  }}
                  error={!!fieldErrors.category}
                  hint={fieldErrors.category}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Level">
                <Select
                  options={[
                    { value: "Beginner", label: "Beginner" },
                    { value: "Intermediate", label: "Intermediate" },
                    { value: "Advanced", label: "Advanced" },
                  ]}
                  value={level}
                  onChange={setLevel}
                />
              </FormField>

              <FormField label="Duration (Hours)">
                <Input
                  type="number"
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                />
              </FormField>

              <FormField label="Price (₹)">
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </FormField>
            </div>

            <FormField label="Description">
              <TextArea
                rows={4}
                value={description}
                onChange={setDescription}
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField label="Image" required htmlFor="image">
                  <FileInput
                    id="image"
                    accept="image/*"
                    error={!!fieldErrors.image}
                    hint={fieldErrors.image}
                    disabled={uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      try {
                        setUploading(true);
                        clearFieldError("image");
                        setError(null);
                        const media = await uploadMedia(file, "temp/courses");
                        setImage(media);
                      } catch (err: any) {
                        setFieldError("image", err.message ?? "Upload failed");
                      } finally {
                        setUploading(false);
                      }
                    }}
                  />
                  {uploading && (
                    <p className="text-sm text-gray-500">Uploading image...</p>
                  )}
                </FormField>

                {image && (
                  <Image
                    src={image.url}
                    alt="Preview"
                    width={120}
                    height={120}
                    className="rounded object-cover border dark:border-gray-800"
                  />
                )}
              </div>

              {image && (
                <div className="space-y-4">
                  <FormField label="Image Alt Text">
                    <Input
                      placeholder="e.g. course image"
                      value={image.alt ?? ""}
                      onChange={(e) =>
                        setImage((prev) =>
                          prev ? { ...prev, alt: e.target.value } : prev,
                        )
                      }
                      hint="Describe the image for SEO & accessibility"
                    />
                  </FormField>

                  <FormField label="Image Caption (optional)">
                    <Input
                      placeholder="Optional caption shown below the image"
                      value={image.caption ?? ""}
                      onChange={(e) =>
                        setImage((prev) =>
                          prev ? { ...prev, caption: e.target.value } : prev,
                        )
                      }
                    />
                  </FormField>
                </div>
              )}
            </div>

            <FormField label="Publish Course">
              <Switch
                label={isPublished ? "Published" : "Draft"}
                defaultChecked={isPublished}
                onChange={setIsPublished}
              />
            </FormField>

            <Authorized
              permission={mode === "create" ? "seo:create" : "seo:update"}
            >
              <FormSEOSection
                value={seo}
                onChange={setSeo}
                uploading={uploadingSeoImg}
                onUploadOgImage={handleUploadOgImage}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            <FormActions
              primaryLabel={
                saving
                  ? "Saving..."
                  : mode === "create"
                    ? "Create Course"
                    : "Update Course"
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
