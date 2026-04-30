import { redirect } from "next/navigation";

type ViewAliasProps = {
  params: Promise<{ id: string }>;
};

export default async function ViewAlias({ params }: ViewAliasProps) {
  const { id } = await params;
  redirect(`/v/${id}`);
}
