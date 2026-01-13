import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { applicationService } from "../services/application.service";
import { CreateApplicationData } from "../types/application.types";

export function useApplicationActions() {
    const { addToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const createApplication = async (data: CreateApplicationData): Promise<boolean> => {
        setIsLoading(true);
        try {
            await applicationService.createApplication(data);
            addToast("Application created successfully", "success");
            return true;
        } catch (error) {
            addToast(
                error instanceof Error ? error.message : "Failed to create application",
                "error"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteApplication = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            await applicationService.deleteApplication(id);
            addToast("Application deleted successfully", "success");
            return true;
        } catch (error) {
            addToast(
                error instanceof Error ? error.message : "Failed to delete application",
                "error"
            );
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createApplication,
        deleteApplication,
        isLoading,
    };
}
