import { describe, it, expect } from 'vitest';

describe('Route Tests', () => {
    it('should return a successful response for the root route', async () => {
        const response = await fetch('/'); // Adjust the URL as needed
        expect(response.status).toBe(200);
    });

    it('should return a not found response for an invalid route', async () => {
        const response = await fetch('/invalid-route'); // Adjust the URL as needed
        expect(response.status).toBe(404);
    });
});