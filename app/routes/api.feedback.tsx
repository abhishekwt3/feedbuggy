import { ActionFunction, LoaderFunction } from '@remix-run/node';
import prisma from '../db.server';

// Handle OPTIONS requests in the loader
export let loader: LoaderFunction = async ({ request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204, // No Content
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins
        'Access-Control-Allow-Methods': 'OPTIONS, POST', // Allowed methods
        'Access-Control-Allow-Headers': 'Content-Type', // Allowed headers
      },
    });
  }

  // If any other method is sent to the loader, return a method not allowed error
  return new Response(null, { status: 405 });
};

// Handle POST requests in the action
export let action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, feedback, shopId } = body;

    if (!feedback) {
      return new Response(JSON.stringify({ message: 'Feedback is required.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!shopId) {
      return new Response(JSON.stringify({ message: 'Shop URL is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    await prisma.feedback.create({
      data: { email: email || null, feedback, shopId },
    });

    return new Response(JSON.stringify({ message: 'Feedback submitted successfully!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to submit feedback.' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
};
