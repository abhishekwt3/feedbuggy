import { json } from "@remix-run/node";

export async function action({ request }) {
  const { feedback } = await request.json();
  console.log("Feedback received:", feedback); // Replace with database logic
  return json({ success: true });
}
