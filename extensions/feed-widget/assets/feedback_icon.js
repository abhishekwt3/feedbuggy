document.addEventListener('DOMContentLoaded', () => {
  const feedbackButton = document.getElementById('feedback-widget-button');
  const feedbackModal = document.getElementById('feedback-modal');
  const closeModalButton = document.getElementById('close-modal');
  const submitFeedbackButton = document.getElementById('submit-feedback');

  // Debugging: Ensure all elements are found
  if (!feedbackButton || !feedbackModal || !closeModalButton || !submitFeedbackButton) {
    console.error('Some elements are missing. Check your HTML structure.');
    return;
  }

  // Show the feedback modal when the feedback button is clicked
  feedbackButton.addEventListener('click', () => {
    feedbackModal.style.display = 'block';
  });

  // Close the modal
  closeModalButton.addEventListener('click', () => {
    feedbackModal.style.display = 'none';
  });

  // Handle feedback submission
  submitFeedbackButton.addEventListener('click', async () => {
    const email = document.getElementById('feedback-email').value;
    const feedbackText = document.getElementById('feedback-text').value;

    // Validate feedback
    if (!feedbackText) {
      alert('Please enter your feedback.');
      return;
    }

    try {
      // Send feedback to API
      const response = await fetch('https://feedbuggy.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, feedback: feedbackText }),
      });

      if (response.ok) {
        alert('Thank you for your feedback!');
        feedbackModal.style.display = 'none';
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('There was an error submitting your feedback. Please try again.');
      }
    } catch (error) {
      console.log('Network error:', error);
      alert('A network error occurred. Please check your connection and try again.');
    }
  });
});
