import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder for Jest
import { TextEncoder, TextDecoder } from "util";

// Use type assertion to satisfy TypeScript
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
