// Example Component
import phone from "../../assets/phone.png";
export default function PhoneIcon() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={phone} 
        alt="phone" 
        className="w-14 h-14" 
      />
    </div>
  );
}