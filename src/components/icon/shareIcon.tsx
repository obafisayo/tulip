// Example Component
import share from "../../assets/share.png";
export default function ShareIcon() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={share} 
        alt="heart" 
        className="w-14 h-14" 
      />
    </div>
  );
}