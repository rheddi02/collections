import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "~/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "~/components/ui/input-otp"
import { cn } from "~/lib/utils"

type OTPInputProps = {
  name: string
  label?: string
  description?: string
  disabled?: boolean
  required?: boolean
  className?: string
  showError?: boolean
  maxLength?: number
}

export function OTPInput({ 
  name, 
  label, 
  description,
  disabled = false,
  required = false,
  className,
  showError = true,
  maxLength = 6,
}: OTPInputProps) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem>
          {label && (
            <FormLabel className={required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}>
              {label}
            </FormLabel>
          )}
          <FormControl>
            <InputOTP
              maxLength={maxLength}
              disabled={disabled}
              value={field.value || ""}
              onChange={field.onChange}
              className={cn(
                fieldState.error && "border-destructive",
                className
              )}
            >
              <InputOTPGroup>
                {Array.from({ length: maxLength }, (_, index) => (
                  <InputOTPSlot 
                    key={index} 
                    index={index}
                    className={fieldState.error ? "border-destructive" : ""}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </FormControl>
          {description && (
            <FormDescription>{description}</FormDescription>
          )}
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}
