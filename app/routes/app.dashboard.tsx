import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import prisma from '../db.server';
import { authenticate } from "../shopify.server";
import { useState } from 'react';
// Define the loader function
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  try {
    const getshopId = await admin.graphql(`query { shop { url } }`);

    if (!getshopId) {
      throw new Response('Shop URL is required.', { status: 400 });
    }

    const shopData = await getshopId.json();
    const shopId = shopData.data.shop.url;

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

// Dashboard Component
export default function DashboardPage() {
  const { feedbackList: initialFeedbackList } = useLoaderData<typeof loader>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [feedbackList, setFeedbackList] = useState(initialFeedbackList);

  const toggleSort = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    const sortedList = [...feedbackList].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFeedbackList(sortedList);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Feedback Dashboard</h1>
      <div style={styles.tableContainer}>
        <div style={styles.sortButtonContainer}>
          <button onClick={toggleSort} style={styles.sortButton}>
            Sort by Date {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <table style={styles.table}>
          <thead>
            <tr>
            <th style={styles.th}>Feedback</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbackList.length === 0 ? (
              <tr>
                <td colSpan={3} style={styles.noData}>
                  No feedback available.
                </td>
              </tr>
            ) : (
              feedbackList.map((feedback) => (
                <tr key={feedback.id}>
                  <td style={styles.td}>{feedback.email || 'Anonymous'}</td>
                  <td style={styles.td}>{feedback.feedback}</td>
                  <td style={styles.td}>
                    {new Date(feedback.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textAlign: 'center',
  },
  tableContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '16px',
    textAlign: 'left',
  },
  th: {
    backgroundColor: '#0070f3',
    color: '#fff',
    padding: '12px 15px',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '16px',
    color: '#555',
  },
  sortButtonContainer: {
    padding: '10px 15px',
    textAlign: 'right',
  },
  sortButton: {
    padding: '8px 12px',
    backgroundColor: '#0070f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
