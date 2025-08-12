import { ReactNode } from "react";
import {
  ChevronDown,
  Megaphone,
  Image as ImageIcon,
  MoreHorizontal,
  X,
  Plus,
  Tag,
  Clock,
  CheckSquare,
  Users,
  AlignLeft,
  MessageCircle,
  Circle,
} from "lucide-react";

interface CommentProps {
  date: string;
  columnName: string;
}

const Comment = (props: CommentProps) => {
  const { date, columnName } = props;
  return (
    <div className="flex items-start space-x-2 mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://avatars1.githubusercontent.com/u/3341965?s=460&v=4"
        alt="avatar"
        className="rounded-full h-8 w-8 flex-shrink-0"
      />
      <div className="flex flex-col flex-1">
        <div className="text-sm">
          <span className="font-semibold">Andrew McDowell</span>
          <span> added this card to {columnName}</span>
        </div>
        <div className="text-gray-500 text-xs mt-1 cursor-pointer hover:underline">
          {date}
        </div>
      </div>
    </div>
  );
};

const Input = () => {
  return (
    <div className="flex items-start space-x-3 mb-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://avatars1.githubusercontent.com/u/3341965?s=460&v=4"
        alt="avatar"
        className="rounded-full h-8 w-8 flex-shrink-0"
      />
      <input
        className="flex-1 p-2 border border-gray-300 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write a comment..."
      />
    </div>
  );
};

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  date: string;
  columnName: string;
  children: ReactNode;
}

const CardDialog = (props: Props): JSX.Element | null => {
  const { open, onClose, title, children, columnName, date } = props;

  if (!open) {
    return null;
  }

  return (
    <div
      className="z-50 absolute inset-0 bg-black bg-opacity-50 overflow-hidden flex justify-center items-center animate-fadeIn"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div
        className="bg-white rounded-lg shadow-xl mx-4 w-full max-w-6xl h-5/6 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1 text-sm font-medium text-gray-700 rounded bg-gray-100 hover:bg-gray-200">
              <span>Info</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <Megaphone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <ImageIcon className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-gray-600 hover:bg-gray-200 rounded"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden text-[#182B4E]">
          {/* Left Panel - Main Card Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Card Title */}
            <div className="flex items-center space-x-3 mb-4">
              <Circle className="w-5 h-5" />
              <div className="text-2xl font-bold leading-relaxed ">{title}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded text-sm font-medium text-gray-600">
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded text-sm font-medium text-gray-600">
                <Tag className="w-4 h-4" />
                <span>Labels</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded text-sm font-medium text-gray-600">
                <Clock className="w-4 h-4" />
                <span>Dates</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded text-sm font-medium text-gray-600">
                <CheckSquare className="w-4 h-4" />
                <span>Checklist</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1 border border-gray-200 hover:bg-gray-200 hover:border-gray-300 rounded text-sm font-medium text-gray-600">
                <Users className="w-4 h-4" />
                <span>Members</span>
              </button>
            </div>

            {/* Description Section */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlignLeft className="w-5 h-5 text-gray-600" />
                  <span className="text-md font-bold text-gray-700">
                    Description
                  </span>
                </div>
                <button className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm px-3 py-1">
                  Edit
                </button>
              </div>
              <div className="text-sm leading-relaxed ml-6">
                {children || "Testing one two three"}
              </div>
            </div>
          </div>

          {/* Right Panel - Comments and Activity */}
          <div className="w-[24rem] border-l border-gray-200 p-6 overflow-y-auto hidden md:block">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">
                  Comments and activity
                </span>
              </div>
              <button className="text-sm bg-gray-100 hover:bg-gray-200 rounded-sm px-3 py-1">
                Show details
              </button>
            </div>

            <Input />
            <Comment date={date} columnName={columnName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDialog;
