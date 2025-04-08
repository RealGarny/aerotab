import { FC, ComponentProps } from 'react'

export const Button:FC<ComponentProps<'button'>> = ({className, ...buttonProps}) => {
  return (
    <button {...buttonProps} className={`cursor-pointer bg-blue-400 px-3 text-white transition-colors hover:bg-blue-500 py-3 rounded-xl  ${className}`}/>
  )
}
