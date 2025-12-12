// Example Component
import microphone from "../../assets/microphone.png";
export default function MicrophoneIcon() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={microphone} 
        alt="heart" 
        className="w-14 h-14" 
      />
    </div>
  );
}