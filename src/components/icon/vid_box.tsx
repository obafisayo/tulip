// Example Component
import vid from "../../assets/video_cam.png";
export default function Vidbox() {
  return (
    <div className="flex flex-col items-center">
      {/* Using a downloaded 3D PNG */}
      <img 
        src={vid} 
        alt="Doctor" 
        className="w-14 h-14" 
      />
    </div>
  );
}