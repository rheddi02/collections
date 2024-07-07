'use client'
import CardTemplate from '../_components/card'
import { api } from '~/trpc/react'
import PageLoader from '../_components/page-loader'

const Dashboard = () => {
  const { data, isFetching } = api.dashboard.get.useQuery()

  if (isFetching) return <PageLoader />
  return (
    <div className='grid grid-cols-3 gap-2'>
      <CardTemplate {...{count: data!.totalHealthTips, label:'health'}} url='health'/>
      <CardTemplate {...{count: data!.totalBeautyTips, label:'beauty'}} url='beauty'/>
      <CardTemplate {...{count: data!.totalEquipmentTips, label:'equipment'}} url='equipment'/>
      <CardTemplate {...{count: data!.totalHomeTips, label:'home'}} url='home'/>
      <CardTemplate {...{count: data!.totalFoodTips, label:'food'}} url='food'/>
      <CardTemplate {...{count: data!.totalPetTips, label:'pet'}} url='pet'/>
      <CardTemplate {...{count: data!.totalClothTips, label:'cloth'}} url='cloth'/>
      <CardTemplate {...{count: data!.totalPlantTips, label:'plant'}} url='plant'/>
      <CardTemplate {...{count: data!.totalMachineryTips, label:'machinery'}} url='machinery'/>
      <CardTemplate {...{count: data!.totalRideTips, label:'ride'}} url='ride'/>
      <CardTemplate {...{count: data!.totalLeisureTips, label:'leisure'}} url='leisure'/>
      <CardTemplate {...{count: data!.totalEnergyTips, label:'energy'}} url='energy'/>
    </div>
  )
}

export default Dashboard