import { ActionFunction } from '@remix-run/node';
import prisma from '../db.server';

export let action: ActionFunction = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, feedback } = body;

    if (!feedback) {
      return new Response(JSON.stringify({ message: 'Feedback is required.' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // Allow all origins
        },
      });
    }

    await prisma.feedback.create({
      data: { email: email || null, feedback },
    });

    return new Response(JSON.stringify({ message: 'Feedback submitted successfully!' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow all origins
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
          'Access-Control-Allow-Origin': '*', // Allow all origins
        },
      }
    );
  }
};
