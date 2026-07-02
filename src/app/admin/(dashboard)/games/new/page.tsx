import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { GameForm } from "../GameForm";

export default function NewGamePage() {
  return (
    <div>
      <AdminPageHeader title="Add Game" description="Create a new game project." />
      <GameForm />
    </div>
  );
}
