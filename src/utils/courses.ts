import type { CollectionEntry } from 'astro:content';

export interface Chapter {
  title: string;
  slug: string;
  order: number;
  lessons: CollectionEntry<'lessons'>[];
}

export function getLessonParts(lesson: CollectionEntry<'lessons'>) {
  const parts = lesson.id.split('/');
  return {
    courseSlug: parts[0],
    chapterSlug: parts[1],
    lessonSlug: parts[2],
  };
}

export function getLessonPath(lesson: CollectionEntry<'lessons'>) {
  const parts = lesson.id.split('/');
  return parts.slice(1).join('/');
}

export function sortLessons(lessons: CollectionEntry<'lessons'>[]) {
  return [...lessons].sort((a, b) => {
    if (a.data.chapterOrder !== b.data.chapterOrder) {
      return a.data.chapterOrder - b.data.chapterOrder;
    }
    return a.data.order - b.data.order;
  });
}

export function groupByChapter(lessons: CollectionEntry<'lessons'>[]): Chapter[] {
  const sorted = sortLessons(lessons);
  const chapters: Chapter[] = [];
  const seen = new Map<string, number>();

  for (const lesson of sorted) {
    const { chapterSlug } = getLessonParts(lesson);
    if (!seen.has(chapterSlug)) {
      seen.set(chapterSlug, chapters.length);
      chapters.push({
        title: lesson.data.chapterTitle,
        slug: chapterSlug,
        order: lesson.data.chapterOrder,
        lessons: [],
      });
    }
    chapters[seen.get(chapterSlug)!].lessons.push(lesson);
  }

  return chapters;
}

export function getAdjacentLessons(
  currentLesson: CollectionEntry<'lessons'>,
  allLessons: CollectionEntry<'lessons'>[],
) {
  const sorted = sortLessons(allLessons);
  const idx = sorted.findIndex((l) => l.id === currentLesson.id);
  return {
    prev: idx > 0 ? sorted[idx - 1] : undefined,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : undefined,
  };
}

export function getLevelLabel(level: string) {
  return { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' }[level] ?? level;
}

export function getLevelColor(level: string) {
  return (
    { beginner: '#16a34a', intermediate: '#2563eb', advanced: '#7c3aed' }[level] ?? 'var(--fg-2)'
  );
}

export function getTypeLabel(type: string) {
  return { reading: 'Reading', video: 'Video', quiz: 'Quiz', exam: 'Exam' }[type] ?? type;
}

export function formatDuration(minutes?: number) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
