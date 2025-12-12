// Example Component
import phone from "../../assets/heart.png";
export default function HeartIcon() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={phone} 
        alt="heart" 
        className="w-14 h-14" 
      />
    </div>
  );
}