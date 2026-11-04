"use client";

import { useState } from "react";
import { deletePerson } from "@/app/people/actions";

export function DeletePersonButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="danger" onClick={() => setOpen(true)}>
        Delete
      </button>
    );
  }
  return (
    <form action={deletePerson.bind(null, id)} className="confirm">
      <p>
        <strong>Are you sure?</strong> Delete {name}? Their interactions go too.
      </p>
      <div className="confirm-actions">
        <button type="submit" className="danger solid">
          Delete person
        </button>
        <button type="button" className="ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
