import { LessonPlayer } from "@/components/lesson/LessonPlayer"

export default function LessonPage({ params }: { params: { id: string } }) {
  return <LessonPlayer lessonId={params.id} />
}
