document.addEventListener('DOMContentLoaded', function() {
  const pendingUsersList = document.getElementById('pendingUsersList');

  // Fetch pending users when the page loads
  fetchPendingUsers();

  // Fetch and display the list of pending users
  async function fetchPendingUsers() {
    try {
      const response = await fetch('http://localhost:3000/api/pending');
      if (!response.ok) {
        throw new Error('Failed to fetch pending users');
      }
      const users = await response.json();
      displayPendingUsers(users);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  }

  // Display the pending users in the list
  function displayPendingUsers(users) {
    pendingUsersList.innerHTML = ''; // Clear previous list
    if (users.length === 0) {
      pendingUsersList.innerHTML = `<li>No pending users at the moment.</li>`;
    } else {
      users.forEach(user => {
        const userElement = createUserElement(user);
        pendingUsersList.appendChild(userElement);
      });
    }
  }

  // Create user elements dynamically
  function createUserElement(user) {
    const userElement = document.createElement('li');
    userElement.innerHTML = `
      <div>
        <strong>${user.name}</strong> (${user.email})
      </div>
      <div>
        <button class="approve" data-id="${user._id}">✔ Approve</button>
        <button class="reject" data-id="${user._id}">✖ Reject</button>
      </div>
    `;
    
    // Add event listeners to the buttons
    userElement.querySelector('.approve').addEventListener('click', () => handleUserAction(user._id, 'approve'));
    userElement.querySelector('.reject').addEventListener('click', () => handleUserAction(user._id, 'reject'));
    
    return userElement;
  }

  // Handle approve or reject actions
  async function handleUserAction(userId, action) {
    const actionMessage = action === 'approve' ? 'approved' : 'rejected';
    try {
      const response = await fetch(`http://localhost:3000/api/${action}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.message || 'User has been '}${actionMessage}!`);
        fetchPendingUsers(); // Refresh the list of pending users
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error during the action');
      }
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      alert(`An unexpected error occurred while ${action} the user.`);
    }
  }
  
});
document.addEventListener('DOMContentLoaded', function() {
  const pendingSubscribersList = document.getElementById('pendingSubscribersList');

  // Fetch pending subscribers when the page loads
  fetchPendingSubscribers();

  // Fetch and display the list of pending subscribers
  async function fetchPendingSubscribers() {
    try {
      const response = await fetch('http://localhost:3000/api/pending/subscribers'); // Adjust URL to your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch pending subscribers');
      }
      const subscribers = await response.json();
      displayPendingSubscribers(subscribers);
    } catch (error) {
      console.error('Error fetching pending subscribers:', error);
    }
  }

  // Display the pending subscribers in the list
  function displayPendingSubscribers(subscribers) {
    pendingSubscribersList.innerHTML = ''; // Clear previous list
    if (subscribers.length === 0) {
      pendingSubscribersList.innerHTML = `<li>No pending subscribers at the moment.</li>`;
    } else {
      subscribers.forEach(subscriber => {
        const subscriberElement = createSubscriberElement(subscriber);
        pendingSubscribersList.appendChild(subscriberElement);
      });
    }
  }

  // Create subscriber elements dynamically
  function createSubscriberElement(subscriber) {
    const subscriberElement = document.createElement('li');
    subscriberElement.innerHTML = `
      <div>
        <strong>${subscriber.name}</strong> (${subscriber.email})
      </div>
      <div>
        <button class="approve" data-id="${subscriber._id}">✔ Approve</button>
        <button class="reject" data-id="${subscriber._id}">✖ Reject</button>
      </div>
    `;
    
    // Add event listeners to the buttons
    subscriberElement.querySelector('.approve').addEventListener('click', () => handleSubscriberAction(subscriber._id, 'approve'));
    subscriberElement.querySelector('.reject').addEventListener('click', () => handleSubscriberAction(subscriber._id, 'reject'));
    
    return subscriberElement;
  }

  // Handle approve or reject actions
  async function handleSubscriberAction(subscriberId, action) {
    const actionMessage = action === 'approve' ? 'approved' : 'rejected';
    try {
      const response = await fetch(`http://localhost:3000/api/${action}/subscriber/${subscriberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.message || 'Subscriber has been '}${actionMessage}!`);
        fetchPendingSubscribers(); // Refresh the list of pending subscribers
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error during the action');
      }
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      alert(`An unexpected error occurred while ${action} the subscriber.`);
    }
  }
});

