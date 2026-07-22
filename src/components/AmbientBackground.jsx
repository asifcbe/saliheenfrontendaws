import React from 'react';

/* Soft gold wisps drifting behind the entire app, fixed to the viewport. */
export default function AmbientBackground() {
  return (
    <div className="ambient-wisps" aria-hidden="true">
      <span className="wisp wisp-1" />
      <span className="wisp wisp-2" />
      <span className="wisp wisp-3" />
      <span className="wisp wisp-4" />
      <span className="wisp wisp-5" />
      <span className="wisp wisp-6" />
      <span className="wisp wisp-7" />
      <span className="wisp wisp-8" />
      <span className="wisp wisp-9" />
    </div>
  );
}
