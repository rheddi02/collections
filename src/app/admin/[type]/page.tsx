import { api } from "~/trpc/server";
import { notFound } from "next/navigation";
import LinkPageClient from "./link-page-client";

interface PageProps {
  params: {
    type: string;
  };
}

const DynamicPage = async ({ params }: PageProps) => {
  const { type: pageTitle } = params;

  try {
    const initialData = await api.categories.getBySlug(
      pageTitle,
    );

    if (!initialData) {
      notFound();
    }

    return <LinkPageClient initialData={initialData} pageTitle={pageTitle} />;
  } catch (error) {
    notFound();
  }
};

export default DynamicPage;
