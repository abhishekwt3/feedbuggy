document.addEventListener('DOMContentLoaded', () => {
  const feedbackButton = document.getElementById('feedback-widget-button');
  const feedbackModal = document.getElementById('feedback-modal');
  const closeModalButton = document.getElementById('close-modal');
  const submitFeedbackButton = document.getElementById('submit-feedback');
  const starRating = document.getElementById('star-rating');
  const stars = starRating.getElementsByClassName('star');
  let currentRating = 0;

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

    // Star rating functionality
    Array.from(stars).forEach(star => {
      star.addEventListener('click', () => {
        currentRating = parseInt(star.getAttribute('data-value'), 10);
        updateStars();
      });
    });

    function updateStars() {
      Array.from(stars).forEach(star => {
        star.classList.toggle('checked', parseInt(star.getAttribute('data-value'), 10) <= currentRating);
      });
    }

  // Handle feedback submission
  submitFeedbackButton.addEventListener('click', async () => {
   // const rating = document.querySelector('input[name="rating"]:checked').value;
    const email = document.getElementById('feedback-email').value;
    const feedbackText = document.getElementById('feedback-text').value;
    const shopId = window.shopUrl;

    // Validate feedback
    if (!feedbackText) {
      alert('Please enter your feedback.');
      return;
    }
    if (!currentRating) {
      alert('Please select a rating.');
      return;
    }
    if (!shopId) {
      alert('Unable to determine the shop URL. Please try again.');
      return;
    }

    try {
      // Send feedback to API
      const response = await fetch('https://feedbuggy.vercel.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, feedback: feedbackText, shopId, rating: currentRating }),
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
