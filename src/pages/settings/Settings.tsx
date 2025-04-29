import React, { useState } from "react";

export default function Settings() {
  const [active, setActive] = useState(true);
  return (
    <div className="m-6 border">
      <div className="flex gap-3">
        <p
          className={`text-sm font-semibold ${active ? "text-blue-800" : ""}`}
          onClick={() => setActive(true)}
        >
          Change Password
        </p>
      </div>
    </div>
  );
}
