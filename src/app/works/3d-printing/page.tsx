import ThreeDPrintingPage from "@frontend/modules/Works/ThreeDPrintingPage";
export const revalidate = 600;

export const metadata = {
  title: "3D Printing Projects - Evansh Services",
  description: "Innovative 3D printing solutions and custom prototypes.",
};

export default function Page() {
  return <ThreeDPrintingPage />;
}
