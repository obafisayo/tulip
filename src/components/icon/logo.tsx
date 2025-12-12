// Example Component
import logo from "../../assets/logo.png";
export default function LogoIcon() {
  return (
    <div className="flex flex-col items-center w-12">
      <img 
        src={logo} 
        alt="logo" 
        className="w-full h-12 object-cover" 
      />
    </div>
  );
}