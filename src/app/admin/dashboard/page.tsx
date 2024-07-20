'use client'
import CardTemplate from '~/app/admin/_components/card'
import { api } from '~/trpc/react'

const Dashboard = () => {
  const { data: beautyTip, isFetching: beautyTipFetching } = api.count.beautyTip.useQuery()
  const { data: healthTip, isFetching: healthTipFetching } = api.count.healthTip.useQuery()
  const { data: equipmentTip, isFetching: equipmentTipFetching } = api.count.equipmentTip.useQuery()
  const { data: homeTip, isFetching: homeTipFetching } = api.count.homeTip.useQuery()
  const { data: foodTip, isFetching: foodTipFetching } = api.count.foodTip.useQuery()
  const { data: petTip, isFetching: petTipFetching } = api.count.petTip.useQuery()
  const { data: clothTip, isFetching: clothTipFetching } = api.count.clothTip.useQuery()
  const { data: plantTip, isFetching: plantTipFetching } = api.count.plantTip.useQuery()
  const { data: machineryTip, isFetching: machineryTipFetching } = api.count.machineryTip.useQuery()
  const { data: rideTip, isFetching: rideTipFetching } = api.count.rideTip.useQuery()
  const { data: leisureTip, isFetching: leisureTipFetching } = api.count.leisureTip.useQuery()
  const { data: energyTip, isFetching: energyTipFetching } = api.count.energyTip.useQuery()

  return (
    <div className='grid sm:grid-cols-3 gap-2'>
      <CardTemplate {...{fetching: healthTipFetching, count: healthTip ?? 0, label:'health'}} url='health'/>
      <CardTemplate {...{fetching: beautyTipFetching, count: beautyTip ?? 0, label:'beauty'}} url='beauty'/>
      <CardTemplate {...{fetching: equipmentTipFetching, count: equipmentTip ?? 0, label:'equipment'}} url='equipment'/>
      <CardTemplate {...{fetching: homeTipFetching, count: homeTip ?? 0, label:'home'}} url='home'/>
      <CardTemplate {...{fetching: foodTipFetching, count: foodTip ?? 0, label:'food'}} url='food'/>
      <CardTemplate {...{fetching: petTipFetching, count: petTip ?? 0, label:'pet'}} url='pet'/>
      <CardTemplate {...{fetching: clothTipFetching, count: clothTip ?? 0, label:'cloth'}} url='cloth'/>
      <CardTemplate {...{fetching: plantTipFetching, count: plantTip ?? 0, label:'plant'}} url='plant'/>
      <CardTemplate {...{fetching: machineryTipFetching, count: machineryTip ?? 0, label:'machinery'}} url='machinery'/>
      <CardTemplate {...{fetching: rideTipFetching, count: rideTip ?? 0, label:'ride'}} url='ride'/>
      <CardTemplate {...{fetching: leisureTipFetching, count: leisureTip ?? 0, label:'leisure'}} url='leisure'/>
      <CardTemplate {...{fetching: energyTipFetching, count: energyTip ?? 0, label:'energy'}} url='energy'/>
    </div>
  )
}

export default Dashboard