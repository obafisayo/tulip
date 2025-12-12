// Example Component
import folder from "../../assets/folder.png";
export default function FolderIcon() {
  return (
    <div className="flex flex-col items-center">
      <img 
        src={folder} 
        alt="heart" 
        className="w-14 h-14" 
      />
    </div>
  );
}