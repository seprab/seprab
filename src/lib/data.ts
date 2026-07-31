// Typed access to the YAML data files. Import from here, never from the
// YAML directly, so every page gets validated data (zod throws at build
// time on malformed edits).
import cvRaw from '../data/cv.yaml';
import kudosRaw from '../data/kudos.yaml';
import projectsRaw from '../data/projects.yaml';
import { cvSchema, kudosSchema, projectsSchema, type Cv } from './schemas';

export const cv = cvSchema.parse(cvRaw);
export const kudos = kudosSchema.parse(kudosRaw);
export const projects = projectsSchema.parse(projectsRaw).sort((a, b) => a.order - b.order);

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** '2020-12' → 'Dec 2020'; '2012' → '2012'; null → 'Present'. */
export function formatYm(value: string | null): string {
  if (value === null) return 'Present';
  const [year, month] = value.split('-');
  return month ? `${MONTHS[Number(month) - 1]} ${year}` : year;
}

export type TimelineEntry = {
  kind: 'work' | 'degree' | 'certification' | 'course';
  title: string; // role or program
  place: string; // company or institution
  start: string;
  end: string | null;
  summary?: string;
  highlights: string[];
  tech: string[];
};

/** Experience + education merged into one reverse-chronological timeline. */
export function timelineEntries(data: Cv = cv): TimelineEntry[] {
  const work: TimelineEntry[] = data.experience.map((e) => ({
    kind: 'work',
    title: e.role,
    place: e.company,
    start: e.start,
    end: e.end,
    summary: e.summary,
    highlights: e.highlights,
    tech: e.tech,
  }));
  const edu: TimelineEntry[] = data.education.map((e) => ({
    kind: e.kind,
    title: e.program,
    place: e.institution,
    start: e.start,
    end: e.end,
    summary: e.details,
    highlights: [],
    tech: [],
  }));
  // String comparison works because dates are 'YYYY' or 'YYYY-MM'.
  return [...work, ...edu].sort((a, b) => b.start.localeCompare(a.start));
}

/** Mean skill level per category, for the radar chart. */
export function skillCategoryAverages(data: Cv = cv): { category: string; value: number }[] {
  const byCategory = new Map<string, number[]>();
  for (const s of data.skills) {
    const list = byCategory.get(s.category) ?? [];
    list.push(s.level);
    byCategory.set(s.category, list);
  }
  return [...byCategory.entries()].map(([category, levels]) => ({
    category,
    value: levels.reduce((a, b) => a + b, 0) / levels.length,
  }));
}
