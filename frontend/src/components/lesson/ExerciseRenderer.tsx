import { ExercisePublic } from "@/hooks/useLesson"
import { MultipleChoice } from "./exercises/MultipleChoice"
import { Translate } from "./exercises/Translate"
import { MatchPairs } from "./exercises/MatchPairs"
import { FillBlank } from "./exercises/FillBlank"
import { TypeAnswer } from "./exercises/TypeAnswer"

export interface ExerciseProps<T = any> {
  exercise: ExercisePublic
  onSubmit: (answer: T) => void
  disabled: boolean
}

export function ExerciseRenderer(props: ExerciseProps) {
  const { exercise } = props
  const type = exercise.type.toLowerCase()

  switch (type) {
    case "multiple_choice":
      return <MultipleChoice key={exercise.id} {...props} />
    case "translate":
      return <Translate key={exercise.id} {...props} />
    case "match_pairs":
      return <MatchPairs key={exercise.id} {...props} />
    case "fill_blank":
      return <FillBlank key={exercise.id} {...props} />
    case "type_answer":
      return <TypeAnswer key={exercise.id} {...props} />
    default:
      return <div>Unsupported exercise type: {exercise.type}</div>
  }
}
