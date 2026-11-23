// Small helpers for turning values into text people read.

/**
 * A number with the right word after it:
 *   countLabel(1, "room")                 gives "1 room"
 *   countLabel(3, "room")                 gives "3 rooms"
 *   countLabel(2, "class", "classes")     gives "2 classes"
 * The plural is the word plus "s" unless another is given.
 */
export function countLabel(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
