import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  User,
  Volume2,
  Zap,
  Menu,
  Star,
  Lock,
  MoreHorizontal,
  Home,
  MailIcon,
} from "lucide-react";
import Dialog from "./Dialog";

const Header = (): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  return (
    <div className="py-3 px-4 flex justify-between items-center bg-[#045C92] mb-2">
      {/* Left side - Profile/User section */}
      <Link href="/">
        <div className="flex items-center space-x-2 text-white cursor-pointer hover:bg-[hsl(203,95%,35%)] rounded px-2 py-1">
          <span className="font-medium">Andrew McDowell</span>
          <span className="text-gray-300">Resume</span>
          <ChevronDown className="w-4 h-4 text-gray-300" />
        </div>
      </Link>

      {/* Right side - Action buttons and icons */}
      <div className="flex items-center space-x-3">
        {/* Home button */}
        <Link href="/">
          <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
            <Home className="w-5 h-5" />
          </button>
        </Link>

        {/* Profile icon */}
        <button className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors">
          <User className="w-4 h-4 text-gray-600" />
        </button>

        {/* Speaker icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <Volume2 className="w-5 h-5" />
        </button>

        {/* Lightning bolt icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <Zap className="w-5 h-5" />
        </button>

        {/* Menu icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <Menu className="w-5 h-5" />
        </button>

        {/* Star icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <Star className="w-5 h-5" />
        </button>

        {/* Lock icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <Lock className="w-5 h-5" />
        </button>

        {/* Share button */}
        <a
          href="mailto:madoliole+resume@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-300 transition-colors">
            <MailIcon className="w-4 h-4" />
            <span className="font-medium">Mail</span>
          </button>
        </a>

        {/* More options icon */}
        <button className="text-white hover:bg-[hsl(203,95%,35%)] rounded p-2 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} />
    </div>
  );
};

export default Header;
