import clsx from "clsx";

type ActionType = "call" | "sms" | "whatsapp" | "link";

type StickyAction = {
  label?: string;
  type?: ActionType;
  href?: string;
};

type StickyActionsProps = {
  actions?: StickyAction[];
};

const typeToLabel: Record<ActionType, string> = {
  call: "Appeler",
  sms: "SMS",
  whatsapp: "WhatsApp",
  link: "Devis",
};

export function StickyActions({ actions }: StickyActionsProps) {
  if (!actions?.length) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-3 rounded-full bg-white/95 px-4 py-3 shadow-2xl shadow-zinc-900/20 md:hidden">
      {actions.map((action, index) => {
        if (!action?.href) return null;
        const resolvedType: ActionType = action.type ?? "link";
        const label = action.label || typeToLabel[resolvedType];
        const href =
          resolvedType === "call" ? `tel:${action.href}` : resolvedType === "sms" ? `sms:${action.href}` : action.href;
        return (
          <a
            key={`${action.href}-${index}`}
            href={href}
            target={resolvedType === "link" ? "_blank" : undefined}
            rel={resolvedType === "link" ? "noreferrer" : undefined}
            className={clsx(
              "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide",
              resolvedType === "link" ? "bg-zinc-900 text-white" : "border border-zinc-900 text-zinc-900"
            )}
          >
            {label}
          </a>
        );
      })}
    </div>
  );
}
