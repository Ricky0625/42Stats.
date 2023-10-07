export enum TextState {
  OK,
  WARNING,
  DESTRUCTIVE
}

const TextBasedContent = ({
  content,
  state = TextState.OK
}: {
  content: string
  state?: TextState
}) => {
  
  return (
    <h1 className={`text-4xl font-black ${state === TextState.OK ? `text-primary` : state === TextState.WARNING ? `text-yellow-500` : `text-destructive`}`}>{content}</h1>
  )
}

export default TextBasedContent