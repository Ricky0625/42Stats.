import Link from "next/link"

const contributors = [
  {
    name: "Ricky",
    github: "Ricky0625"
  },
  {
    name: "Xue Rui",
    github: "wangxuerui2003"
  },
  {
    name: "Joseph",
    github: "Kiotto-code"
  },
]

const Footer = () => {
  return (
    <footer className="bottom-0 supports-backdrop-blur:bg-background/60 z-50 w-full border-t bg-background/95 backdrop-blur fixed">
      <div className="container h-8 items-center text-foreground/40 text-xs md:flex hidden">
        Develop by&nbsp;
        {contributors.map((contributor, i) => (
          <>
            <Link key={`${i}+${contributor.github}`} href={`https://github.com/${contributor.github}`} className="hover:underline" target="_blank">{contributor.name}</Link>
            {i < contributors.length - 1 && <>,&nbsp;</>}
          </>
        ))}
        &nbsp;@ 42KL Peer-Defence Hackathon 2023
      </div>
    </footer>      
  )
}

export default Footer