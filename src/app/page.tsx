import HomePage from "@frontend/modules/Home/HomePage";
export const revalidate = 3600;

export default function Page() {
  return <HomePage />;
}
