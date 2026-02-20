import "server-only";

export function mapStudent(student: any) {
  return {
    id: String(student._id),
    phone: student.phone,
    fullName: student.fullName,
    email: student.email,
    isActive: student.isActive,
    lastLoginAt: student.lastLoginAt,
    createdAt: student.createdAt,
  };
}
