/**
 * Get the appropriate dashboard path based on user role/type
 */
export function getDashboardPathByUserType(
  userType: string | undefined,
): string {
  if (!userType) return "/";

  const type = userType.toLowerCase();

  switch (type) {
    case "doctor":
      return "/doctorDash";
    case "staff":
      return "/doctorDash";
<<<<<<< HEAD
    case "admin":
      return "/dashboard";
=======
>>>>>>> 5e8e71014b3dc60a0847c0c5b32d7e14443c51a5
    case "patient":
    case "clinic":
    default:
      return "/";
  }
}
