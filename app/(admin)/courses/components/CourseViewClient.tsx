"use client";

import { useRouter } from "next/navigation";

import { Authorized } from "@/components/auth/Authorized";

import { FormHeader, FormError } from "@/components/form";
import FormSkeleton from "@/components/skeletons/FormSkeleton";

import {
  ViewActions,
  ViewBadge,
  ViewField,
  ViewImage,
  ViewSection,
  ViewSEOSection,
} from "@/components/view";

import { useAdminEntity } from "@/hooks";

import type { Course } from "@/lib/types";

type Props = {
  id: string;
};

export default function CourseViewClient({ id }: Props) {
  const router = useRouter();

  const {
    data: course,
    loading,
    error,
  } = useAdminEntity<Course>({
    endpoint: "courses",
    id,
  });

  return (
    <div className="space-y-6">
      <FormHeader title="View Course" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        {loading ? (
          <FormSkeleton />
        ) : error ? (
          <FormError error={error} />
        ) : !course ? null : (
          <div className="space-y-6">
            {/* Sticky Overview */}
            <div className="sm:sticky top-30 z-10 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <ViewField label="Title" value={course.title} mono />
                <ViewField label="Slug" value={course.slug} mono />
                <ViewField
                  label="Category"
                  value={
                    typeof course.category === "object"
                      ? course.category.name
                      : course.category
                  }
                />
                <ViewField label="Level" value={course.level} />
                <ViewField label="Price" value={`₹${course.price}`} />
                <ViewField
                  label="Duration (Hours)"
                  value={course.durationHours ?? 0}
                />
                <ViewField
                  label="Total Lessons"
                  value={course.totalLessons ?? 0}
                />

                <div>
                  <p className="text-sm text-gray-500 mb-2">Status</p>
                  <ViewBadge
                    label={course.isPublished ? "Published" : "Draft"}
                    variant={course.isPublished ? "success" : "warning"}
                  />
                </div>
              </div>
            </div>

            {/* Image Section */}
            {course.image && (
              <ViewSection>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-6">
                    <ViewImage
                      label="Course Image"
                      src={course.image.url}
                      alt={course.image.alt ?? course.title}
                      caption={course.image.caption}
                      size={180}
                    />
                  </div>
                </div>
              </ViewSection>
            )}

            {/* Description */}
            {course.description && (
              <div>
                <ViewField label="Description" value={course.description} />
              </div>
            )}

            {/* SEO */}
            <Authorized permission="seo:read">
              <ViewSEOSection
                seo={course.seo}
                collapsible
                defaultOpen={false}
              />
            </Authorized>

            {/* Meta */}
            <ViewSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ViewField
                  label="Created At"
                  value={new Date(course.createdAt).toLocaleString()}
                  mono
                />
                <ViewField
                  label="Last Updated"
                  value={new Date(course.updatedAt).toLocaleString()}
                  mono
                />
              </div>
            </ViewSection>

            {/* Actions */}
            <ViewActions
              primaryLabel="Edit Course"
              primaryPermission="course:update"
              onPrimary={() => router.push(`/courses/${id}/edit`)}
              onBack={() => router.back()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
