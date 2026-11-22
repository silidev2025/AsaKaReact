// Joins CSS class names, skipping empty or false ones. Handy for classes
// that only apply sometimes:
//   cx(s.pin, isActive && s.active)  gives "pin active" or just "pin"

export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(" ");
}
