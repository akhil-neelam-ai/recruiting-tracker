import { toggleStar } from "@/app/stars/actions";

export function StarButton({
  companyId,
  starred,
  name,
}: {
  companyId: number;
  starred: boolean;
  name: string;
}) {
  const label = starred ? `Unstar ${name}` : `Star ${name}`;

  return (
    <form action={toggleStar} className="star-form">
      <input type="hidden" name="companyId" value={companyId} />
      <input type="hidden" name="intent" value={starred ? "unstar" : "star"} />
      <button type="submit" className={starred ? "star on" : "star"} aria-pressed={starred} aria-label={label}>
        {starred ? "★ Starred" : "☆ Star"}
      </button>
    </form>
  );
}
