'use client'
import { useMemo } from 'react'
import CardTemplate from '~/app/admin/_components/card'
import { api } from '~/trpc/react'

const Dashboard = () => {
  const { data: counts, isFetching, error } = api.count.all.useQuery(
    undefined, // No input needed - user context comes from NextAuth session
    {
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false, // Don't refetch on window focus
    }
  )

  // Memoized card configuration to avoid recreating on every render
  const cardConfigs = useMemo(() => [
    { key: 'healthTip', label: 'health', url: 'tips/health' },
    { key: 'beautyTip', label: 'beauty', url: 'tips/beauty' },
    { key: 'equipmentTip', label: 'equipment', url: 'tips/equipment' },
    { key: 'homeTip', label: 'home', url: 'tips/home' },
    { key: 'foodTip', label: 'food', url: 'tips/food' },
    { key: 'petTip', label: 'pet', url: 'tips/pet' },
    { key: 'clothTip', label: 'cloth', url: 'tips/cloth' },
    { key: 'plantTip', label: 'plant', url: 'tips/plant' },
    { key: 'machineryTip', label: 'machinery', url: 'tips/machinery' },
    { key: 'rideTip', label: 'ride', url: 'tips/ride' },
    { key: 'leisureTip', label: 'leisure', url: 'tips/leisure' },
    { key: 'energyTip', label: 'energy', url: 'tips/energy' },
  ] as const, [])

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        <p>Failed to load dashboard data</p>
        <p className="text-sm text-gray-500">{error.message}</p>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {cardConfigs.map(({ key, label, url }) => (
        <CardTemplate
          key={key}
          fetching={isFetching}
          count={counts?.[key] ?? 0}
          label={label}
          url={url}
        />
      ))}
    </div>
  )
}

export default Dashboard