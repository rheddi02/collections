'use client'
import CardTemplate from '../_components/card'
import { api } from '~/trpc/react'
import PageLoader from '../_components/page-loader'

const Dashboard = () => {
  const { data, isFetching } = api.dashboard.get.useQuery()

  if (isFetching) return <PageLoader />
  return (
    <div className='grid grid-cols-3 gap-2'>
      <CardTemplate {...{count: data!.totalHealthTips, label:'health'}} url='health-tips'/>
      <CardTemplate {...{count: data!.totalBeautyTips, label:'beauty'}} url='beauty-tips'/>
      <CardTemplate {...{count: data!.totalEquipmentTips, label:'equipment'}} url='equipment-tips'/>
      <CardTemplate {...{count: data!.totalHomeTips, label:'home'}} url='home-tips'/>
      <CardTemplate {...{count: data!.totalFoodTips, label:'food'}} url='food-tips'/>
      <CardTemplate {...{count: data!.totalPetTips, label:'pet'}} url='pet-tips'/>
      <CardTemplate {...{count: data!.totalClothTips, label:'cloth'}} url='cloth-tips'/>
      <CardTemplate {...{count: data!.totalPlantTips, label:'plant'}} url='plant-tips'/>
      <CardTemplate {...{count: data!.totalMachineryTips, label:'machinery'}} url='machinery-tips'/>
      <CardTemplate {...{count: data!.totalRideTips, label:'ride'}} url='ride-tips'/>
      <CardTemplate {...{count: data!.totalLeisureTips, label:'leisure'}} url='leisure-tips'/>
      <CardTemplate {...{count: data!.totalEnergyTips, label:'energy'}} url='energy-tips'/>
    </div>
  )
}

export default Dashboard