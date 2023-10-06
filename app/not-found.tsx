import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className='grid place-items-center items-center'>
      <h1 className='text-9xl font-bold'>404</h1>
      <Button asChild>
        <Link href="/" className='text-accent-foreground'>Back To Home</Link>
      </Button>
    </div>
  )
}