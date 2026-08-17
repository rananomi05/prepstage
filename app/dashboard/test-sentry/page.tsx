"use client";

import * as Sentry from "@sentry/nextjs";

export default function TestSentryPage() {
    const testSentry = () => {
        const error = new Error(
            "Test Sentry Integration - Assignment"
        );

        Sentry.captureException(error);

        alert("Test error sent to Sentry!");
    };

    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="rounded-xl border p-8 text-center shadow">
                <h1 className="mb-3 text-2xl font-bold">
                    Sentry Test Page
                </h1>

                <p className="mb-6 text-gray-600">
                    Click the button to send a test error to Sentry.
                </p>

                <button
                    onClick={testSentry}
                    className="rounded-lg bg-purple-600 px-5 py-3 text-white"
                >
                    Test Sentry
                </button>
            </div>
        </main>
    );
}