import { redirect } from "next/navigation";

type ViewAliasProps = {
  params: { id: string };
};

export default function ViewAlias({ params }: ViewAliasProps) {
  redirect(`/v/${params.id}`);
}
