import { getTrash } from "@/libs/trash";
import TableTrash from "./_TableTrash";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Trash",
};

async function TrashPage() {
  const data = await getTrash();

  return <TableTrash data={Array.isArray(data) ? data : []} />;
}

export default TrashPage;
