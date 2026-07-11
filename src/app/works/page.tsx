import WorksPage from "@frontend/modules/Works/WorksPage";
export const revalidate = 600;

export const metadata = {
  title: "Our Work - Evansh Services",
  description: "Explore our diverse portfolio of digital solutions, from web portals to custom inventory systems.",
};

export default function Page() {
  return <WorksPage />;
}
