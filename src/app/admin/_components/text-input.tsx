import * as React from "react"
import { Controller, useFormContext } from "react-hook-form"
import { 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormDescription, 
  FormMessage 
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"

type TextInputProps = {
  name: string
  label?: string
  placeholder?: string
  description?: string
  type?: "text" | "password" | "email" | "number"
  disabled?: boolean
  required?: boolean
  className?: string
  showError?: boolean
  renderDescription?: (field: any) => React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'disabled' | 'required' | 'className'>

export function TextInput({ 
  name, 
  label, 
  placeholder, 
  description,
  type = "text",
  disabled = false,
  required = false,
  className,
  showError = true,
  renderDescription,
  ...props 
}: TextInputProps) {
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
            <Input
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                fieldState.error && "border-destructive focus-visible:ring-destructive",
                className
              )}
              {...field}
              {...props}
            />
          </FormControl>
          {description && !renderDescription && (
            <FormDescription>{description}</FormDescription>
          )}
          {renderDescription && (
            <FormDescription>{renderDescription(field)}</FormDescription>
          )}
          {showError && <FormMessage />}
        </FormItem>
      )}
    />
  )
}