import loadingGif from "../assets/illustrations/loading.gif";
import "./DonutLoader.css";

/**
 * The real loader from Figma: the "Loading animation" layer is a rectangle with
 * an animated GIF fill, which MCP surfaces as a still PNG. The GIF itself comes
 * from the node's raw image fills, so this is the designed motion rather than a
 * reconstruction.
 *
 * Geometry matches the design: a 200px square window with the 227x142 artwork
 * centred and cropped.
 */
export function DonutLoader({ size = 200 }: { size?: number }) {
  const scale = size / 200;

  return (
    <div className="donut" style={{ width: size, height: size }}>
      <img
        src={loadingGif}
        alt="Loading"
        style={{ width: 227 * scale, height: 142 * scale }}
      />
    </div>
  );
}
