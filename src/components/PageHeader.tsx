import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ badge, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <Badge variant="outline" className="mb-2 text-[10px] font-semibold tracking-widest uppercase border-primary/30 text-primary bg-primary/5">
        {badge}
      </Badge>
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
      )}
    </div>
  );
}
