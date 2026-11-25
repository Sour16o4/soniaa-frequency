// NEXT_DIST_DIR lets a production build run beside `next dev` without the two sharing .next.
export default { distDir: process.env.NEXT_DIST_DIR || '.next' };
