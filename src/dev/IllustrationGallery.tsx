import { SendIllustration, DeleteIllustration } from "../components/SendIllustration";
import { DonutLoader } from "../components/DonutLoader";

/** Dev-only view (open the app with #gallery) for eyeballing the artwork. */
export function IllustrationGallery() {
  const items = [
    { label: "img/send", node: <SendIllustration /> },
    { label: "img/delete_profile", node: <DeleteIllustration /> },
    { label: "loader", node: <DonutLoader size={227} /> },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        gap: 48,
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        padding: 48,
      }}
    >
      {items.map((item) => (
        <figure
          key={item.label}
          style={{ margin: 0, display: "grid", justifyItems: "center", gap: 12 }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              display: "grid",
              placeItems: "center",
              background: "var(--bg-surface-primary)",
              borderRadius: 16,
            }}
          >
            {item.node}
          </div>
          <figcaption className="t-b3-regular u-secondary">{item.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
