import { LessonPlayer } from "@/components/lesson/LessonPlayer"

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <LessonPlayer lessonId={id} />
}

