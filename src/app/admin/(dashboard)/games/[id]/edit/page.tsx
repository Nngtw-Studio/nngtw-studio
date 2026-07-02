import { notFound } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAdminGameById } from "@/lib/supabase/queries/admin/games";
import { GameForm } from "../../GameForm";

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const game = await getAdminGameById(id);
  if (!game) notFound();

  return (
    <div>
      <AdminPageHeader title="Edit Game" description={game.title} />
      <GameForm game={game} />
    </div>
  );
}
