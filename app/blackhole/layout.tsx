"use client"

import { TextState } from "@/components/TextBasedContent";
import { BatchData, BlackholeState } from "./blackholeData";
import React from "react";

export const BlackholeContext = React.createContext<BlackholeState>({
  mbhd: 60,
  setMbhd: (mbhd: number) => { },
  data: [],
  batch: { year: 0, month: 0 },
  setBatch: (batch: BatchData) => { },
  viewState: TextState.WARNING,
  setViewState: (viewState: TextState) => { },
});

export default function BlackholeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    children
  )
}