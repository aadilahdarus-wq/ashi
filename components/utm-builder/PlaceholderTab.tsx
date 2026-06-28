type PlaceholderTabProps = {
  title: string;
  description: string;
};

export function PlaceholderTab({ title, description }: PlaceholderTabProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-8">
      <h2 className="text-[15px] font-semibold text-text">{title}</h2>
      <p className="mt-2 max-w-md text-[13px] leading-relaxed text-text-3">
        {description}
      </p>
    </div>
  );
}
