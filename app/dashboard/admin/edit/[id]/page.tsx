import EditUser from "../../_components/EditUser";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditUser id={id} />;
}
