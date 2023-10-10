import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TabGroups = ({
  tabNames,
  tabContents,
}: {
  tabNames: string[],
  tabContents: React.ReactNode[]
}) => (
  <Tabs defaultValue={tabNames[0]} className="mt-2">
    <TabsList>
      {tabNames.map((tname, i) => (
        <TabsTrigger key={i} value={tname}>{tname}</TabsTrigger>
      ))}
    </TabsList>
    {tabContents.map((cont, i) => (
      <TabsContent key={`tab-${i}-${tabNames[i]}`} value={tabNames[i]}>{cont}</TabsContent>
    ))}
  </Tabs>
)

export default TabGroups