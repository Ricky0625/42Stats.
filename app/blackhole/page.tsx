"use client"

import BlackholeFilterForm from "@/components/BlackholeFilterForm"
import { TextState } from "@/components/TextBasedContent"
import React, { useContext } from "react"
import { BatchData } from "./blackholeData"
import { BlackholeContext } from "./layout"
import BlackholeOverview from "./BlackholeOverview"
import TabGroups from "@/components/TabGroup"
import NotifyEmail from "@/components/NotifyEmail"
import BlackholeAnalysis from "./BlackholeAnalysis"

const getBlackholeUsers = async (year?: number, month?: number) => {
  let URL = `/api/blackhole`

  if (month === 0 || year === 0) {
    const res = await fetch(URL);
    const resJson = await res.json();
    return resJson;
  }

  URL = URL + `?batch_year=${year}&batch_month=${month}`
  const res = await fetch(URL);
  const resJson = await res.json();
  return resJson;
}

export default function Blackhole() {

  const [mbhd, setMbhd] = React.useState(60);
  const [data, setData] = React.useState([]);
  const [viewState, setViewState] = React.useState(TextState.WARNING);
  const [batch, setBatch] = React.useState<BatchData>({
    month: 0,
    year: 0,
  });
  const bhCtx = useContext(BlackholeContext);

  React.useEffect(() => {
    const fetchData = async () => {
      return await getBlackholeUsers(batch.year, batch.month)
    }

    fetchData().then(res => setData(res))
  }, [mbhd, batch])

  return (
    <BlackholeContext.Provider value={{
      mbhd: mbhd,
      setMbhd: setMbhd,
      data: data,
      batch: batch,
      setBatch: setBatch,
      viewState: viewState,
      setViewState: setViewState,
    }}>
      <div className="container relative pt-6 max-h-screen">
        <div className="flex w-full flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight transition-colors first:mt-0">Blackhole</h2>
          <div className="flex flex-row items-center space-x-2">
            <BlackholeFilterForm />
            <NotifyEmail />
          </div>
        </div>
        <TabGroups
          tabNames={["Overview", "Analysis"]}
          tabContents={[<BlackholeOverview />, <BlackholeAnalysis batch={batch} />]}
        />
      </div>
    </BlackholeContext.Provider>
  )
}