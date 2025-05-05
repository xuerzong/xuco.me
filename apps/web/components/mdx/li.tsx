export const Li = ({ className, ...restProps }: React.HTMLProps<HTMLLIElement>) => {
  return <li className={`list-disc list-inside pl-4 text-sm ${className}`} {...restProps} />
}
