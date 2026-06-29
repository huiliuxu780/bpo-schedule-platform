import Link from "next/link"

import { Button } from "@/components/ui/button"

type StatusFilterPillsProps<T extends string> = {
  options: { label: string; value?: T }[]
  activeValue?: T
  buildHref: (value: T | undefined) => string
}

export function StatusFilterPills<T extends string>({
  options,
  activeValue,
  buildHref,
}: StatusFilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((option) => {
        const active =
          option.value === activeValue || (!option.value && !activeValue)

        return (
          <Button
            key={option.label}
            asChild
            variant={active ? "default" : "outline"}
            size="sm"
          >
            <Link
              aria-current={active ? "page" : undefined}
              href={buildHref(option.value)}
            >
              {option.label}
            </Link>
          </Button>
        )
      })}
    </div>
  )
}
