"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CommonOutputType } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";

const Page = () => {
  const appStore = useAppStore();
  const [loaded, setLoaded] = useState(false)
  // const [result, setResult] = useState([])
  const [food, setFood] = useState<CommonOutputType[]>([])

  const {data: result} = api.list.foodTip.useQuery({},{
    enabled: loaded
  })
  useEffect( () => {
    // setResult(res.data)
    setLoaded(true)
  },[])
  useEffect( () => {
    setFood(result?.data || [])
  },[result?.data])
  return (
    <div className="p-5">
      <div className="flex flex-col gap-5">
        <span className="text-3xl font-bold">
        Home
        </span>
        <div className="flex gap-2 flex-wrap text-gray-100">
          {food.map((data) => (
            <div className="rounded-md bg-gray-500 p-2 w-96" key={data.id}>
              <Link href={data.url}>
              {
                data.title
              }
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
