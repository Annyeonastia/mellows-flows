import sendImg from "../assets/illustrations/send.png";
import deleteImg from "../assets/illustrations/delete-profile.png";
import "./SendIllustration.css";

/*
 * Both illustrations live in a shared Figma library, so their component nodes
 * are not reachable through MCP. They are exported from the frames that use
 * them instead of being reassembled from loose vectors — reassembly produced a
 * visibly wrong drawing. Re-export at 2x/3x from Figma if a crisper asset is
 * wanted.
 */

/** "img/send" — the paper-plane on the All Invited modal. */
export function SendIllustration({ size = 240 }: { size?: number }) {
  return (
    <img
      className="illus"
      src={sendImg}
      alt=""
      aria-hidden="true"
      style={{ width: size, height: size }}
    />
  );
}

/** "img/delete_profile" — the bin on the delete confirmation modals. */
export function DeleteIllustration({ size = 240 }: { size?: number }) {
  return (
    <img
      className="illus"
      src={deleteImg}
      alt=""
      aria-hidden="true"
      style={{ width: size, height: size }}
    />
  );
}
