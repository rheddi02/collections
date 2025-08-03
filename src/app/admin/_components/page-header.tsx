import { HamburgerMenuIcon, PlusIcon, ReloadIcon } from '@radix-ui/react-icons'
import React from 'react'
import { Button } from '~/components/ui/button'

type Props = {
  title: string;
  action: () => void;
  setOpenMenu: () => void;
  isFetching: boolean;
  label: string
}

const PageHeader = ({title, label, action, setOpenMenu, isFetching}: Props) => {
  return (
    <div className="flex flex-col gap-2 font-bold sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span onClick={setOpenMenu}>
              <HamburgerMenuIcon className="block h-5 w-5 sm:hidden" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl capitalize">{title}</span>
              {isFetching && <ReloadIcon className="animate-spin" />}
            </div>
          </div>
          <Button onClick={action} className="flex gap-2">
            <PlusIcon className="h-4 w-4" />
            {label}
          </Button>
        </div>
  )
}

export default PageHeader