import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MetricCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card className="@container/card min-h-32 bg-gradient-to-t from-primary/5 to-card shadow-md shadow-black/5 transition-shadow hover:shadow-lg">
      <CardHeader className="pb-1">
        <CardDescription className="text-sm">{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums @[240px]/card:text-4xl">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
