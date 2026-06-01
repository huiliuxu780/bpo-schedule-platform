import type { ReactNode } from "react"

import { type ImportPageHierarchy } from "@/components/import-center-model"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ImportCenterDetailTabsProps = {
  hierarchy: ImportPageHierarchy
  batchDetailPanel: ReactNode
  rowCorrectionPanel: ReactNode
  resultTracePanel: ReactNode
  dataToolsPanel: ReactNode
}

export function ImportCenterDetailTabs({
  hierarchy,
  batchDetailPanel,
  rowCorrectionPanel,
  resultTracePanel,
  dataToolsPanel,
}: ImportCenterDetailTabsProps) {
  return (
    <section
      id="import-detail-workspace"
      className="scroll-mt-16 border-t bg-background pt-4"
    >
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-base font-medium">分层详情</h2>
        <p className="text-sm text-muted-foreground">{hierarchy.layoutIntent}</p>
      </div>
      <Tabs defaultValue={hierarchy.defaultDetailTab} className="flex-col gap-4">
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          <TabsTrigger value="batch-detail">{hierarchy.detailTabs[0]}</TabsTrigger>
          <TabsTrigger value="row-correction">{hierarchy.detailTabs[1]}</TabsTrigger>
          <TabsTrigger value="result-trace">{hierarchy.detailTabs[2]}</TabsTrigger>
          <TabsTrigger value="data-tools">{hierarchy.detailTabs[3]}</TabsTrigger>
        </TabsList>
        <TabsContent value="batch-detail" className="m-0">
          {batchDetailPanel}
        </TabsContent>
        <TabsContent value="row-correction" className="m-0">
          {rowCorrectionPanel}
        </TabsContent>
        <TabsContent value="result-trace" className="m-0">
          {resultTracePanel}
        </TabsContent>
        <TabsContent value="data-tools" className="m-0">
          <div className="grid gap-4">{dataToolsPanel}</div>
        </TabsContent>
      </Tabs>
    </section>
  )
}
