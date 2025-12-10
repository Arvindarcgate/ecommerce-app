
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSubscribeNewsletter } from "./useSubscribeNewsletter";
import { API_BASE_URL } from '../config/env';

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

       
        await result.current.mutateAsync("test@example.com");

        // Assertions
        expect(global.fetch).toHaveBeenCalledWith(
            `${API_BASE_URL}/api/subscribe`,
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
