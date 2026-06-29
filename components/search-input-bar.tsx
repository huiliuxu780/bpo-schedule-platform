import { Search } from "lucide-react"
import { type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type SearchInputBarProps = {
  defaultQuery: string
  placeholder: string
  hiddenFields?: Record<string, string>
  children?: ReactNode
}

export function SearchInputBar({
  defaultQuery,
  placeholder,
  hiddenFields,
  children,
}: SearchInputBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3 shadow-xs">
      <form className="flex min-w-[min(28rem,100%)] flex-1 items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border bg-background px-2">
          <Search className="size-4 text-muted-foreground" />
          <Input
            name="query"
            defaultValue={defaultQuery}
            placeholder={placeholder}
            className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
        {hiddenFields
          ? Object.entries(hiddenFields).map(([name, value]) => (
              <input key={name} name={name} type="hidden" value={value} />
            ))
          : null}
        <Button type="submit" variant="outline" size="sm">
          搜索
        </Button>
      </form>
      {children}
    </section>
  )
}
