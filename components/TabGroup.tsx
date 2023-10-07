import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TabGroups = ({
  tabNames,
  tabContents,
}: {
  tabNames: string[],
  tabContents: React.ReactNode[]
}) => {
  return (
    <Tabs defaultValue={tabNames[0]} className="w-[400px]">
      <TabsList>
        {tabNames.map((tname, i) => (
          <TabsTrigger key={i} value={tname}>{tname}</TabsTrigger>
        ))}
      </TabsList>
      {tabContents.map((cont, i) => (
        <TabsContent value={tabNames[i]}>{cont}</TabsContent>
      ))}
      <TabsContent value="account">Make changes to your account here.</TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  )
}

export default TabGroups