import CoursesPage from "@frontend/modules/Courses/CoursesPage";
export const revalidate = 1800;

export const metadata = {
  title: "Our Courses - Evansh Services",
  description: "Explore our range of professional IT courses designed for your success.",
};

export default function Page() {
  return <CoursesPage />;
}
