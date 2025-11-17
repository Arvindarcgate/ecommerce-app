
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubscribeNewsletter } from "./useSubscribeNewsletter";

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe("useSubscribeNewsletter", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should call API and succeed", async () => {
        // Mock fetch success
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Subscribed successfully" }),
            })
        ) as jest.Mock;

        const { result } = renderHook(() => useSubscribeNewsletter(), {
            wrapper: createWrapper(),
        });

        // Perform mutation
        await result.current.mutateAsync("test@example.com");

        // Assertions
        expect(global.fetch).toHaveBeenCalledWith(
            "http://localhost:8000/api/subscribe",
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
        );

        // Expect success result
        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true);
        });
    });

    it("should throw error on failed response", async () => {
        // Mock fetch failure
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                json: () => Promise.resolve({ error: "Email already subscribed" }),
            })
        ) as jest.Mock;

        const { result } = renderHook(() => useSubscribeNewsletter(), {
            wrapper: createWrapper(),
        });

        await expect(
            result.current.mutateAsync("test@example.com")
        ).rejects.toThrow("Email already subscribed");
    });
});
