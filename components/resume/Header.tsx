import Link from "next/link";
import { useState } from "react";
import Dialog from "./Dialog";

const VerticalBar = (): JSX.Element => (
  <div className="text-blue-500 text-lg align-middle p-2">|</div>
);

const Header = (): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  return (
    <div className="py-2 flex justify-start bg-[#045C92] mb-2">
      <div className="flex">
        <Link
          href="/"
          className="text-white text-lg font-bold hover:bg-blue-400 rounded px-4 py-2 ml-2 mr-1 hover:cursor-pointer self-center"
        >
          Andrew McDowell - Resume
        </Link>
        <div className="hidden md:flex">
          <button
            className="px-4 mx-1 rounded hover:bg-blue-400 cursor-pointer"
            onClick={handleOpenDialog}
          >
            <span role="img">⭐</span>
          </button>
          <VerticalBar />
          <button
            className="text-white hover:bg-blue-400 rounded px-4 mx-1 text-base cursor-pointer"
            onClick={handleOpenDialog}
          >
            Personal
          </button>
          <VerticalBar />
          <button
            className="text-white hover:bg-blue-400 rounded px-4 mx-1 text-base cursor-pointer"
            onClick={handleOpenDialog}
          >
            🌐 Public
          </button>
        </div>
      </div>
      <div className="hidden md:flex mx-4">
        <button
          className="text-white hover:bg-blue-400 rounded px-4 mx-1 text-base cursor-pointer"
          onClick={handleOpenDialog}
        >
          🛎 Butler
        </button>
        <button
          className="text-white hover:bg-blue-400 rounded px-4 mx-1 text-base cursor-pointer"
          onClick={handleOpenDialog}
        >
          Show Menu
        </button>
      </div>
      <Dialog open={dialogOpen} onClose={handleClose} />
    </div>
  );
};

export default Header;
