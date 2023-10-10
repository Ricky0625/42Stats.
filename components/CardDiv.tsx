import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CardDiv = ({
  title,
  icon,
  description,
  content,
  footer,
}: {
  title?: string
  icon?: React.ReactNode
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="py-4 text-sm">
        <span className="inline-flex items-center justify-between">
          <h3 className="tracking-tight font-semibold">{title}</h3>
          {icon}
        </span>
        {description === undefined || <CardDescription className="hidden lg:block">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1">
        {content}
      </CardContent>
      {footer === undefined || <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}

export default CardDiv