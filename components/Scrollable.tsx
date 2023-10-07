const Scrollable = ({children}: {children: React.ReactNode}) => {
  return(
    <div className="max-h-full w-full bg-slate-900 overflow-y-scroll">
      {children}
    </div>
  )
}

export default Scrollable