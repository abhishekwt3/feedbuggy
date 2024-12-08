document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const feedbackWidgetButton = document.getElementById("feedback-widget-button");
    const feedbackModal = document.getElementById("feedback-modal");
    const closeModalButton = document.getElementById("close-modal");
    const submitFeedbackButton = document.getElementById("submit-feedback");
    const feedbackText = document.getElementById("feedback-text");
  
    // Show the feedback modal
    feedbackWidgetButton.addEventListener("click", () => {
      feedbackModal.style.display = "block";
    });
  
    // Hide the feedback modal
    closeModalButton.addEventListener("click", () => {
      feedbackModal.style.display = "none";
    });
  
    // Submit feedback
    submitFeedbackButton.addEventListener("click", async () => {
      const feedback = feedbackText.value.trim();
  
      if (!feedback) {
        alert("Please enter your feedback before submitting.");
        return;
      }
  
      try {
        // Send feedback to your app's API
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ feedback }),
        });
  
        if (response.ok) {
          alert("Thank you for your feedback!");
          feedbackText.value = ""; // Clear the textarea
          feedbackModal.style.display = "none"; // Close the modal
        } else {
          alert("Something went wrong. Please try again later.");
        }
      } catch (error) {
        console.error("Error submitting feedback:", error);
        alert("Error submitting feedback. Please try again.");
      }
    });
  });
  