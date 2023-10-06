import Link from "next/link"

const contributors = [
  {
    name: "Ricky",
    intra: "wricky-t",
    github: "Ricky0625"
  },
  {
    name: "Xue Rui",
    intra: "wxuerui",
    github: "wangxuerui2003"
  },
  {
    name: "Joseph",
    intra: "yichan",
    github: "Kiotto-code"
  },
]

const Footer = () => {
  return (
    <footer className="bottom-0 supports-backdrop-blur:bg-background/60 z-50 w-full border-t bg-background/95 backdrop-blur fixec">
      <div className="container h-8 items-center text-foreground/40 text-xs md:flex hidden">
        Develop by&nbsp;
        {contributors.map((contributor, i) => (
          <>
            <Link key={`${i}+${contributor.github}`} href={`https://github.com/${contributor.github}`} className="hover:underline" target="_blank">{contributor.name}</Link>
            (<Link key={`${i}+${contributor.intra}`} href={`https://profile.intra.42.fr/users/${contributor.intra}`} className="hover:underline" target="_blank">{contributor.intra}</Link>)
            {i < contributors.length - 1 && <>,&nbsp;</>}
          </>
        ))}
        &nbsp;@ Peer-Defence Hackathon 2023
      </div>
    </footer>      
  )
}

export default Footer