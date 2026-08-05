import intercomBg from "../assets/icons/intercom-bg.svg";
import iconMessage from "../assets/icons/icon-message.svg";
import "./Intercom.css";

/** Decorative support bubble present on every frame in the design. */
export function Intercom() {
  return (
    <div className="intercom" aria-hidden="true">
      <img className="intercom__bg" src={intercomBg} alt="" />
      <img className="intercom__icon" src={iconMessage} alt="" />
    </div>
  );
}
