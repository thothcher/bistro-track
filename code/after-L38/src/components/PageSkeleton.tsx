// Shown for as long as the code of a page is being downloaded (see App.tsx)
export function PageSkeleton() {
  return (
    <p className="status" role="status">
      Loading the page…
    </p>
  );
}
