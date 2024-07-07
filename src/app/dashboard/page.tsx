'use client'
import CardTemplate from '../_components/card'
import { api } from '~/trpc/react'
import PageLoader from '../_components/page-loader'

const Dashboard = () => {
  const { data, isFetching } = api.dashboard.get.useQuery()

  if (isFetching) return <PageLoader />
  return (
    <div className='grid grid-cols-3 gap-2'>
      <CardTemplate {...{count: data?.totalHealthTips ?? 0, label:'health'}} url='health'/>
      <CardTemplate {...{count: data?.totalBeautyTips ?? 0, label:'beauty'}} url='beauty'/>
      <CardTemplate {...{count: data?.totalEquipmentTips ?? 0, label:'equipment'}} url='equipment'/>
      <CardTemplate {...{count: data?.totalHomeTips ?? 0, label:'home'}} url='home'/>
      <CardTemplate {...{count: data?.totalFoodTips ?? 0, label:'food'}} url='food'/>
      <CardTemplate {...{count: data?.totalPetTips ?? 0, label:'pet'}} url='pet'/>
      <CardTemplate {...{count: data?.totalClothTips ?? 0, label:'cloth'}} url='cloth'/>
      <CardTemplate {...{count: data?.totalPlantTips ?? 0, label:'plant'}} url='plant'/>
      <CardTemplate {...{count: data?.totalMachineryTips ?? 0, label:'machinery'}} url='machinery'/>
      <CardTemplate {...{count: data?.totalRideTips ?? 0, label:'ride'}} url='ride'/>
      <CardTemplate {...{count: data?.totalLeisureTips ?? 0, label:'leisure'}} url='leisure'/>
      <CardTemplate {...{count: data?.totalEnergyTips ?? 0, label:'energy'}} url='energy'/>
    </div>
  )
}

export default Dashboard