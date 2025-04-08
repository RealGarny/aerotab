import { FC, ComponentProps } from 'react';

export const Input:FC<ComponentProps<'input'> &{error?:boolean}> = ({className, error, ...inputProps}) => {
  return (
    <div className={'flex flex-col'}>
    <input
      {...inputProps}
      className={`cursor-pointer bg-slate-100 px-3 transition-colors border border-slate-200 py-3 rounded-xl  ${className}`}
    />
      {error && <p>поле обязательно для заполнения</p>}
    </div>
  )
}
