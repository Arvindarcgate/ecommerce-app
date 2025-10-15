import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSubscribeNewsletter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (email: string) => {
            const response = await fetch("http://localhost:8000/api/subscribe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Subscription failed");
            }

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["subscribers"] });
        },
    });
}
