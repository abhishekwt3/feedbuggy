import { LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import prisma from '../db.server';

// Define the loader function
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const shopId = url.searchParams.get('shopUrl');

    if (!shopId) {
      throw new Response('Shop URL is required.', { status: 400 });
    }

    // Fetch feedback from the database for the current shop
    const feedbackList = await prisma.feedback.findMany({
      where: { shopId },
      orderBy: { createdAt: 'desc' }, // Sort by most recent feedback
    });


    // Return data directly
    return { feedbackList };
  } catch (error) {
    console.error('Error loading feedback:', error);
    throw new Response('Failed to load feedback.', { status: 500 });
  }
};

// Dashboard component
export default function DashboardPage() {
  const { feedbackList } = useLoaderData<typeof loader>();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Feedback Dashboard</h1>
      <table cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Feedback</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {feedbackList.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center' }}>
                No feedback available.
              </td>
            </tr>
          ) : (
            feedbackList.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.email || 'Anonymous'}</td>
                <td>{feedback.feedback}</td>
                <td>{new Date(feedback.createdAt).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
