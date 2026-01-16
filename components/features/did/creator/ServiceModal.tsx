import React, { useState } from "react";
import { X, Edit2 } from "lucide-react";
import { Service, ServiceType } from "@/lib/features/did/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Forced HMR Refresh: 4

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: Service) => void;
}

export function ServiceModal({ isOpen, onClose, onAdd }: ServiceModalProps) {
  const [serviceType, setServiceType] = useState<ServiceType>("DecentralizedWebNode");
  const [serviceId, setServiceId] = useState("#myservice");
  const [serviceEndpoint, setServiceEndpoint] = useState("");

  const handleAdd = () => {
    if (serviceId && serviceEndpoint) {
      onAdd({
        id: serviceId,
        type: serviceType,
        serviceEndpoint,
      });
      setServiceId("#myservice");
      setServiceEndpoint("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="max-w-[700px] p-0 overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl rounded-lg"
      >
        <div className="bg-white dark:bg-slate-950 p-8 space-y-8">
          <DialogHeader className="flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#e0f2fe] dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-800">
                <svg
                  className="text-blue-600 dark:text-blue-400 size-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <DialogTitle className="text-xl font-bold text-[#1e293b] dark:text-slate-100">
                Add Service
              </DialogTitle>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1" title="close dialog">
              <X size={20} />
            </button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Service type: <span className="font-medium text-slate-500 ml-1">{serviceType}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  ["DIDCommMessaging", "DecentralizedWebNode", "LinkedDomains"] as ServiceType[]
                ).map((type) => {
                  const isSelected = serviceType === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setServiceType(type)}
                      className={cn(
                        "h-11 px-2 text-[13px] font-medium transition-all rounded-[3px] border",
                        isSelected
                          ? "bg-[#2c3e50] text-white border-[#2c3e50] font-bold shadow-md"
                          : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                      )}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Service id
              </label>
              <div className="relative">
                <Input
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="h-11 px-4 pr-10 border-[#1e293b] dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm"
                  placeholder="#myservice"
                />
                <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[13px] font-bold text-slate-700 dark:text-slate-300">
                Service endpoint
              </label>
              <div className="relative">
                <Input
                  value={serviceEndpoint}
                  onChange={(e) => setServiceEndpoint(e.target.value)}
                  placeholder="Service endpoint"
                  className="h-11 px-4 pr-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-[3px] shadow-sm"
                />
                <Edit2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="font-medium text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 px-6 h-10 rounded-[3px]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!serviceEndpoint || !serviceId}
              className="bg-white hover:bg-slate-50 text-slate-800 font-medium border border-slate-300 dark:border-slate-700 px-6 h-10 rounded-[3px]"
            >
              Add Service
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
