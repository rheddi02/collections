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
    </div>
  )
}

export default Dashboard