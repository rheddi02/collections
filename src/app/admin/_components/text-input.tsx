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
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons"

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
  showPasswordToggle?: boolean
  renderDescription?: (field: any) => React.ReactNode
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'disabled' | 'required' | 'className'>

export default function TextInput({ 
  name, 
  label, 
  placeholder, 
  description,
  type = "text",
  disabled = false,
  required = false,
  className,
  showError = true,
  showPasswordToggle = false,
  renderDescription,
  ...props 
}: TextInputProps) {
  const { control } = useFormContext()
  const [showPassword, setShowPassword] = React.useState(false)

  const isPasswordField = type === "password"
  const inputType = isPasswordField && showPassword ? "text" : type

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
            <div className="relative">
              <Input
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  fieldState.error && "border-destructive focus-visible:ring-destructive focus:border-0",
                  (isPasswordField && showPasswordToggle) && "pr-10",
                  className
                )}
                {...field}
                {...props}
              />
              {isPasswordField && showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disabled}
                >
                  {!showPassword ? (
                    <EyeClosedIcon className="h-4 w-4" />
                  ) : (
                    <EyeOpenIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {!showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              )}
            </div>
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