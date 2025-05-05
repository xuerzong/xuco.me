export const Ul = ({ className, ...restProps }: React.HTMLProps<HTMLUListElement>) => {
  return <ul className={`list-disc list-inside space-y-2 ${className}`} {...restProps} />
}
