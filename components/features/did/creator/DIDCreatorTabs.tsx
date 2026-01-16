import { TabType } from "@/lib/features/did/types";

interface DIDCreatorTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasCreatedDID: boolean;
  hasError: boolean;
}

export function DIDCreatorTabs({
  activeTab,
  onTabChange,
  hasCreatedDID,
  hasError,
}: DIDCreatorTabsProps) {
  return (
    <div className="flex p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-fit mb-8 shadow-sm">
      <Tab
        label="Request"
        active={activeTab === "request"}
        onClick={() => onTabChange("request")}
      />
      <Tab
        label="Response"
        active={activeTab === "response"}
        onClick={() => onTabChange("response")}
        disabled={!hasCreatedDID}
      />
      <Tab
        label="Error"
        active={activeTab === "error"}
        onClick={() => onTabChange("error")}
        disabled={!hasError}
      />
    </div>
  );
}

function Tab({
  label,
  active,
  onClick,
  disabled,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-8 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${
        disabled
          ? "text-slate-400 dark:text-slate-600 cursor-not-allowed hidden md:block"
          : active
            ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-800/50"
      }`}
    >
      {label}
    </button>
  );
}
