import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import cls from 'classnames'
import * as Popover from '@radix-ui/react-popover'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

const menus = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'About',
    path: '/about',
  },
  {
    name: 'Uses',
    path: '/uses',
  },
]

const Navigation: React.FC = () => {
  const pathname = usePathname()
  return (
    <nav>
      <ul className="flex items-center space-x-6">
        {menus.map((menu) => (
          <li key={menu.path}>
            <NextLink href={menu.path}>
              <span className={cls({ 'text-primary-600': pathname === menu.path })}>
                {menu.name}
              </span>
            </NextLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

const NavigationPopover: React.FC = () => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-2 bg-gray-200 dark:bg-gray-900 rounded">
          <AdjustmentsHorizontalIcon className="w-4 h-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          className="bg-white py-2 rounded border z-50 dark:bg-gray-900 dark:border-gray-950"
        >
          <ul>
            {menus.map((menu) => (
              <li key={menu.path}>
                <NextLink href={menu.path}>
                  <span className="block w-full py-1 px-4 hover:bg-gray-200 dark:hover:bg-gray-950">
                    {menu.name}
                  </span>
                </NextLink>
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export default Object.assign(Navigation, { Popover: NavigationPopover })
