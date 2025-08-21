"use client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Link as LinkIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const CardTemplate = ({
  count,
  label,
  description,
  url,
  fetching,
  size = "default",
  icon,
}: {
  count: number;
  label: string;
  description?: string;
  url: string;
  fetching: boolean;
  size?: "default" | "compact";
  icon?: React.ReactNode;
}) => {
  const router = useRouter();
  const handleRoute = () => {
    router.push(url);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleRoute();
    }
  };
  const isCompact = size === "compact";

  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={handleRoute}
      className="group overflow-hidden rounded-xl border bg-card transition-colors hover:bg-muted/50"
    >
      <CardHeader className={`relative capitalize ${isCompact ? "p-3" : ""}`}>
        <CardTitle className="flex items-center justify-between text-foreground">
          <span className={`font-semibold tracking-tight ${isCompact ? "text-base" : ""}`}>
            <span className="mr-2 inline-flex items-center gap-2">
              {icon ? <span className="text-muted-foreground">{icon}</span> : null}
              {label}
            </span>
          </span>
          <div
            className="rounded-full p-2 text-muted-foreground transition-colors group-hover:text-foreground hover:bg-muted"
            aria-label="Open category"
            onClick={(e) => {
              e.stopPropagation();
              handleRoute();
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </div>
        </CardTitle>
        {description && !isCompact && (
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className={`flex items-end justify-between ${isCompact ? "p-3" : "p-4"}`}>
        {fetching ? (
          <ReloadIcon className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          <p className={`pl-1 font-bold tracking-tight ${isCompact ? "text-xl" : "text-3xl"}`}>
            {count.toLocaleString()}
          </p>
        )}
        <p className={`text-muted-foreground ${isCompact ? "text-xs" : "text-sm"}`}>Total records</p>
      </CardContent>
      {/* <CardFooter className="bg-red-200 p-10">
      </CardFooter> */}
    </Card>
  );
};

export default CardTemplate;