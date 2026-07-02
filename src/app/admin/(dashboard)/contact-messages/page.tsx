import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { getAdminContactMessages } from "@/lib/supabase/queries/admin/contact-messages";
import { formatDate } from "@/lib/utils";
import { deleteMessage } from "./actions";
import { MessageReadToggle } from "./MessageReadToggle";

export default async function AdminContactMessagesPage() {
  const messages = await getAdminContactMessages();

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description="View and manage incoming contact form submissions." />

      <div className="space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-brand-grey">No messages yet.</p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-center justify-between border border-brand-white/5 p-4 ${
              message.read ? "opacity-60" : ""
            }`}
          >
            <div>
              <h3 className={message.read ? "text-sm text-brand-grey" : "text-sm text-brand-white"}>
                {message.subject}
                {!message.read && <span className="ml-2 text-xs text-brand-orange">New</span>}
              </h3>
              <p className="text-xs text-brand-grey">
                {message.name} ({message.email}) · {message.type} · {formatDate(message.created_at)}
              </p>
              <p className="mt-1 max-w-xl text-xs text-brand-grey/70">{message.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <MessageReadToggle id={message.id} read={message.read} />
              <DeleteButton
                action={deleteMessage.bind(null, message.id)}
                confirmMessage={`Delete message from "${message.name}"?`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
