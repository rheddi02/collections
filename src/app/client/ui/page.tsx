"use client";

import { ArrowLeftIcon, ExternalLinkIcon, ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import type { CommonOutputType } from "~/server/api/client/types";
import useAppStore from "~/store/app.store";
import { api } from "~/trpc/react";

// Configuration mapping for page types to their respective API calls
const PAGE_CONFIG = {
  beauty: { query: 'beautyTip', title: 'Beauty Tips' },
  cloth: { query: 'clothTip', title: 'Clothing Tips' },
  energy: { query: 'energyTip', title: 'Energy Tips' },
  equipment: { query: 'equipmentTip', title: 'Equipment Tips' },
  food: { query: 'foodTip', title: 'Food Tips' },
  health: { query: 'healthTip', title: 'Health Tips' },
  home: { query: 'homeTip', title: 'Home Tips' },
  leisure: { query: 'leisureTip', title: 'Leisure Tips' },
  machinery: { query: 'machineryTip', title: 'Machinery Tips' },
  plant: { query: 'plantTip', title: 'Plant Tips' },
  pet: { query: 'petTip', title: 'Pet Tips' },
  ride: { query: 'rideTip', title: 'Ride Tips' },
  coin: { query: 'coin', title: 'Coin Collection' },
} as const;

type PageType = keyof typeof PAGE_CONFIG;

const ClientPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") as PageType | null;
  const setIsFetching = useAppStore((state) => state.setIsFetching);

  // Memoize the page configuration
  const pageConfig = useMemo(() => {
    if (!page || !PAGE_CONFIG[page]) return null;
    return PAGE_CONFIG[page];
  }, [page]);

  // Use conditional queries instead of dynamic property access
  const beautyQuery = api.list.beautyTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'beauty', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const clothQuery = api.list.clothTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'cloth', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const energyQuery = api.list.energyTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'energy', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const equipmentQuery = api.list.equipmentTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'equipment', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const foodQuery = api.list.foodTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'food', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const healthQuery = api.list.healthTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'health', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const homeQuery = api.list.homeTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'home', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const leisureQuery = api.list.leisureTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'leisure', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const machineryQuery = api.list.machineryTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'machinery', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const plantQuery = api.list.plantTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'plant', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const petQuery = api.list.petTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'pet', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const rideQuery = api.list.rideTip.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'ride', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );
  const coinQuery = api.list.coin.useQuery(
    { page: 1, perPage: 100 },
    { enabled: page === 'coin', staleTime: 5 * 60 * 1000, refetchOnWindowFocus: false }
  );

  // Get the active query based on page type
  const activeQuery = useMemo(() => {
    switch (page) {
      case 'beauty': return beautyQuery;
      case 'cloth': return clothQuery;
      case 'energy': return energyQuery;
      case 'equipment': return equipmentQuery;
      case 'food': return foodQuery;
      case 'health': return healthQuery;
      case 'home': return homeQuery;
      case 'leisure': return leisureQuery;
      case 'machinery': return machineryQuery;
      case 'plant': return plantQuery;
      case 'pet': return petQuery;
      case 'ride': return rideQuery;
      case 'coin': return coinQuery;
      default: return null;
    }
  }, [page, beautyQuery, clothQuery, energyQuery, equipmentQuery, foodQuery, healthQuery, homeQuery, leisureQuery, machineryQuery, plantQuery, petQuery, rideQuery, coinQuery]);

  const data = activeQuery?.data;
  const isLoading = activeQuery?.isLoading ?? false;
  const error = activeQuery?.error;
  const refetch = activeQuery?.refetch;

  // Update global loading state
  useEffect(() => {
    setIsFetching(isLoading);
  }, [isLoading, setIsFetching]);

  const handleReturnPage = () => {
    router.push('/client');
  };

  const handleRefresh = () => {
    if (refetch) {
      refetch();
    }
  };

  // Handle invalid page
  if (!page || !pageConfig) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-4">
        <Label className="text-xl text-gray-500">Invalid page type</Label>
        <Button onClick={handleReturnPage} variant="outline">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Return to Client
        </Button>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full bg-gray-200 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-gray-100"
            onClick={handleReturnPage}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <Label className="text-2xl font-bold uppercase">{pageConfig.title}</Label>
        </div>
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <Label className="text-xl text-red-500">Failed to load {pageConfig.title.toLowerCase()}</Label>
          <p className="text-sm text-gray-500">{error.message}</p>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline">
              <ReloadIcon className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button onClick={handleReturnPage} variant="default">
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const items = data?.data || [];

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="rounded-full bg-gray-200 p-2 hover:cursor-pointer hover:bg-gray-500 hover:text-gray-100 transition-colors"
            onClick={handleReturnPage}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </div>
          <Label className="text-2xl font-bold uppercase">{pageConfig.title}</Label>
        </div>
        
        {/* Stats and Refresh */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{items.length} items</span>
          <Button 
            onClick={handleRefresh} 
            variant="ghost" 
            size="sm"
            disabled={isLoading}
          >
            <ReloadIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center gap-2">
            <ReloadIcon className="h-6 w-6 animate-spin" />
            <Label>Loading {pageConfig.title.toLowerCase()}...</Label>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-96 gap-4">
          <Label className="text-xl text-gray-500">No {pageConfig.title.toLowerCase()} found</Label>
          <Button onClick={handleRefresh} variant="outline">
            <ReloadIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      )}

      {/* Content Grid */}
      {!isLoading && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {items.map((item: CommonOutputType) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

// Separate component for better performance and readability
const ItemCard = ({ item }: { item: CommonOutputType }) => {
  return (
    <div className="group h-full">
      <Link href={item.url} target="_blank" className="block h-full">
        <div className="rounded-lg bg-gray-600 p-4 hover:border-2 hover:border-gray-400 h-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-3">
            <Label className="text-lg font-semibold text-gray-100 leading-tight flex-1 mr-2">
              {item.title}
            </Label>
            <ExternalLinkIcon className="h-4 w-4 text-gray-300 group-hover:text-white transition-colors flex-shrink-0" />
          </div>
          
          <div className="group-hover:hidden text-sm text-gray-300 overflow-hidden">
            <div className="h-16 overflow-hidden">
              {item.description || 'No description available'}
            </div>
          </div>
          
          <div className="hidden group-hover:block text-xs text-gray-400 break-all">
            {item.url}
          </div>
          
          {/* Additional metadata if available */}
          {item.type && (
            <div className="mt-2 pt-2 border-t border-gray-500">
              <span className="text-xs bg-gray-500 px-2 py-1 rounded text-gray-200">
                {item.type}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ClientPage;
