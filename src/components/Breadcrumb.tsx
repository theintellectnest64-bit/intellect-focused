import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; path: string }[] = [{ label: "Home", path: "/" }];

  segments.forEach((seg, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    const label = seg
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    crumbs.push({ label, path });
  });

  return (
    <nav className="container mx-auto px-4 lg:px-8 py-2" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 font-body text-xs">
        {crumbs.map((crumb, i) => (
          <li key={crumb.path} className="flex items-center gap-1">
            {i > 0 && <span style={{ color: "#DBEAFE" }}>&gt;</span>}
            {i === crumbs.length - 1 ? (
              <span style={{ color: "#0D1E3B" }}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="hover:underline" style={{ color: "#2B7DD4" }}>
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
