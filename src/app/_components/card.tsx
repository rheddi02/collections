'use client'
import { LinkNone2Icon } from "@radix-ui/react-icons";
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
}: {
  count: number;
  label: string;
  description?: string;
  url: string;
}) => {
  const router = useRouter()
  const handleRoute = () => {
    router.push(url)
  }
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardHeader className="relative bg-gray-200 capitalize">
        <CardTitle>
          {label}
          <div className="right-fixed right-10 p-3 rounded-full hover:bg-white hover:cursor-pointer" onClick={handleRoute}>
            <LinkNone2Icon />
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between p-2">
        <p className="text-4xl ">{count}</p>
        <p className="text-sm uppercase text-gray-500">total record</p>
      </CardContent>
      {/* <CardFooter className="bg-red-200 p-10">
      </CardFooter> */}
    </Card>
  );
};

export default CardTemplate;
