import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout {...baseOptions()}>
      <div className="mx-auto w-full max-w-7xl px-6 pb-24 pt-10 sm:px-8 lg:px-12">
        {children}
      </div>
    </HomeLayout>
  );
}
