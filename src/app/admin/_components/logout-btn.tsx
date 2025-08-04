"use client";

import { PinLeftIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { signOut } from 'next-auth/react'
import React, { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"

const LogoutBtn = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleLogoutClick = () => {
    setShowConfirmDialog(true)
  }

  const handleConfirmLogout = () => {
    setShowConfirmDialog(false)
    signOut({ callbackUrl: '/' })
  }

  const handleCancelLogout = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <Button 
        className='flex gap-2' 
        variant={'secondary'} 
        onClick={handleLogoutClick}
      >
        <PinLeftIcon />
        <Label className="select-none group-hover:font-bold">Logout</Label>
      </Button>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleCancelLogout}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default LogoutBtn