"use client";

import { useState } from "react";
import { deleteCompany } from "@/app/companies/actions";

export function DeleteCompanyButton({ id, name }: { id: number; name: string }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button type="button" className="danger" onClick={() => setOpen(true)}>
        Delete
      </button>
    );
  }

  return (
    <form action={deleteCompany.bind(null, id)} className="confirm">
      <p>
        <strong>Are you sure?</strong> Delete {name}? This can&apos;t be undone.
      </p>
      <div className="confirm-actions">
        <button type="submit" className="danger solid">
          Delete company
        </button>
        <button type="button" className="ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
