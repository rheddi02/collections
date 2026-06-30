import { FolderIcon, LinkIcon, UserIcon } from "lucide-react";

type ActivityEvent = {
  type: "user" | "link" | "category";
  label: string;
  at: Date;
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const iconMap = {
  user: <UserIcon className="h-3.5 w-3.5 text-blue-500" />,
  link: <LinkIcon className="h-3.5 w-3.5 text-green-500" />,
  category: <FolderIcon className="h-3.5 w-3.5 text-orange-500" />,
};

export default function ActivityFeed({ events }: { events: ActivityEvent[] }) {
  if (!events.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No recent activity</p>;
  }

  return (
    <div className="divide-y">
      {events.map((e, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted">
            {iconMap[e.type]}
          </span>
          <p className="flex-1 text-sm">{e.label}</p>
          <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(e.at)}</span>
        </div>
      ))}
    </div>
  );
}
