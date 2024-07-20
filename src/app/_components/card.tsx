"use client";
import { LinkNone2Icon, ReloadIcon } from "@radix-ui/react-icons";
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
}: {
  count: number;
  label: string;
  description?: string;
  url: string;
  fetching: boolean;
}) => {
  const router = useRouter();
  const handleRoute = () => {
    router.push(url);
  };
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="relative bg-gray-200 capitalize">
        <CardTitle>
          {label}
          <div
            className="right-fixed rounded-full p-3 hover:cursor-pointer hover:bg-white sm:right-10"
            onClick={handleRoute}
          >
            <LinkNone2Icon />
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between p-2">
        {fetching ? (
          <ReloadIcon className="animate-spin" />
        ) : (
          <p className="pl-3 text-4xl">{count}</p>
        )}
        <p className="text-sm uppercase text-gray-500">total record</p>
      </CardContent>
      {/* <CardFooter className="bg-red-200 p-10">
      </CardFooter> */}
    </Card>
  );
};

export default CardTemplate;
