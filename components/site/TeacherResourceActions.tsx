import { deleteResourceAction, updateResourceStatusAction } from "@/app/admin/actions";

type TeacherResourceActionsProps = {
  resourceId: string;
};

export default function TeacherResourceActions({ resourceId }: TeacherResourceActionsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border/70 pt-4">
      <a
        href={`/admin?resource=${resourceId}`}
        className="rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground"
      >
        Editar
      </a>

      <form action={updateResourceStatusAction}>
        <input type="hidden" name="resourceId" value={resourceId} />
        <input type="hidden" name="status" value="DRAFT" />
        <button
          type="submit"
          className="rounded-full border border-border/70 px-3 py-2 text-xs text-muted-foreground"
        >
          Ocultar
        </button>
      </form>

      <form action={deleteResourceAction}>
        <input type="hidden" name="resourceId" value={resourceId} />
        <button
          type="submit"
          className="rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200"
        >
          Eliminar
        </button>
      </form>
    </div>
  );
}
