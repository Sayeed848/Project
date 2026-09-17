async function handleContactSubmit(event) {
  event.preventDefault();

  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const subject = document.getElementById('f-subject').value.trim();
  const message = document.getElementById('f-message').value.trim();
  const statusDiv = document.getElementById('form-status');
  const btn = document.getElementById('send-btn');

  if (!name || !email || !message) {
    statusDiv.style.display = 'block';
    statusDiv.style.color = 'var(--coral)';
    statusDiv.textContent = '⚠️ Please fill in all required fields.';
    return;
  }

  btn.textContent = 'Sending...';
  btn.style.opacity = '0.7';
  btn.disabled = true;

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      statusDiv.style.display = 'block';
      statusDiv.style.color = 'var(--accent3)';
      statusDiv.textContent = '✓ Thank you! Your message has been saved into PostgreSQL database.';
      document.getElementById('contactForm').reset();
      btn.textContent = 'Sent ✓';
    } else {
      throw new Error(data.error || 'Failed to submit message');
    }
  } catch (err) {
    statusDiv.style.display = 'block';
    statusDiv.style.color = 'var(--coral)';
    statusDiv.textContent = '❌ Error submitting message. Please email sydrj116@gmail.com directly.';
  } finally {
    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.opacity = '1';
      btn.disabled = false;
    }, 3000);
  }
}
