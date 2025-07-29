"use client";

import { ArrowLeftIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import type { CommonOutputType } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";

const ClientPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page] = useState(searchParams.get("page"));
  const [data, setData] = useState<CommonOutputType[]>([]);
  const setIsFetching = useAppStore((state) => state.setIsFetching);

  const { data: beautyTip } = api.list.beautyTip.useQuery(
    {},
    { enabled: page == "beauty" },
  );
  const { data: clothTip } = api.list.clothTip.useQuery(
    {},
    { enabled: page == "cloth" },
  );
  const { data: energyTip } = api.list.energyTip.useQuery(
    {},
    { enabled: page == "energy" },
  );
  const { data: equipmentTip } = api.list.equipmentTip.useQuery(
    {},
    { enabled: page == "equipment" },
  );
  const { data: foodTip } = api.list.foodTip.useQuery(
    {},
    { enabled: page == "food" },
  );
  const { data: healthTip } = api.list.healthTip.useQuery(
    {},
    { enabled: page == "health" },
  );
  const { data: homeTip } = api.list.homeTip.useQuery(
    {},
    { enabled: page == "home" },
  );
  const { data: leisureTip } = api.list.leisureTip.useQuery(
    {},
    { enabled: page == "leisure" },
  );
  const { data: machineryTip } = api.list.machineryTip.useQuery(
    {},
    { enabled: page == "machinery" },
  );
  const { data: plantTip } = api.list.plantTip.useQuery(
    {},
    { enabled: page == "plant" },
  );
  const { data: petTip } = api.list.petTip.useQuery(
    {},
    { enabled: page == "pet" },
  );
  const { data: rideTip } = api.list.rideTip.useQuery(
    {},
    { enabled: page == "ride" },
  );
  const { data: coin } = api.list.coin.useQuery(
    {},
    { enabled: page == "coin" },
  );

  useEffect(() => {
    setIsFetching(true);
    setData([]);
  }, []);

  useEffect(() => {
    setIsFetching(false);
  }, [data]);

  useEffect(() => {
    if (beautyTip?.data) {
      // setIsFetching(false);
      setData(beautyTip.data);
    }
  }, [beautyTip?.data]);
  
  useEffect(() => {
    if (clothTip?.data) {
      // setIsFetching(false);
      setData(clothTip.data);
    }
  }, [clothTip?.data]);
  
  useEffect(() => {
    if (energyTip?.data) {
      // setIsFetching(false);
      setData(energyTip.data);
    }
  }, [energyTip?.data]);
  
  useEffect(() => {
    if (equipmentTip?.data) {
      // setIsFetching(false);
      setData(equipmentTip.data);
    }
  }, [equipmentTip?.data]);
  
  useEffect(() => {
    if (foodTip?.data) {
      // setIsFetching(false);
      setData(foodTip.data);
    }
  }, [foodTip?.data]);
  
  useEffect(() => {
    if (healthTip?.data) {
      // setIsFetching(false);
      setData(healthTip.data);
    }
  }, [healthTip?.data]);
  
  useEffect(() => {
    if (homeTip?.data) {
      // setIsFetching(false);
      setData(homeTip.data);
    }
  }, [homeTip?.data]);
  
  useEffect(() => {
    if (leisureTip?.data) {
      // setIsFetching(false);
      setData(leisureTip.data);
    }
  }, [leisureTip?.data]);
  
  useEffect(() => {
    if (machineryTip?.data) {
      // setIsFetching(false);
      setData(machineryTip.data);
    }
  }, [machineryTip?.data]);
  
  useEffect(() => {
    if (plantTip?.data) {
      // setIsFetching(false);
      setData(plantTip.data);
    }
  }, [plantTip?.data]);
  
  useEffect(() => {
    if (petTip?.data) {
      // setIsFetching(false);
      setData(petTip.data);
    }
  }, [petTip?.data]);
  
  useEffect(() => {
    if (rideTip?.data) {
      // setIsFetching(false);
      setData(rideTip.data);
    }
  }, [rideTip?.data]);
  
  useEffect(() => {
    if (coin?.data) {
      // setIsFetching(false);
      setData(coin.data);
    }
  }, [coin?.data]);

  const handleReturnPage = () => {
    router.push('/client');
  };

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex items-center gap-2">
        <div
          className="rounded-full bg-gray-200 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-gray-100"
          onClick={handleReturnPage}
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </div>
        <Label className="text-2xl font-bold uppercase">{page}</Label>
      </div>
      <div className="flex flex-wrap text-gray-100">
        {data.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-lg p-1 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 3xl:w-1/6 items-stretch"
          >
            <Link href={item.url} target="_blank">
              <div className="rounded-lg bg-gray-600 p-2 hover:border-2 h-full group">
                <div className="flex justify-between">
                  <Label className="text-3xl sm:text-xl font-semibold">{item.title}</Label>
                  <ExternalLinkIcon className="h-4 w-4 sm:h-4 sm:w-4" />
                </div>
                <div className="group-hover:hidden text-xl sm:text-base">{item.description}</div>
                <div className="hidden group-hover:block text-sm text-muted">{item.url}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPage;
