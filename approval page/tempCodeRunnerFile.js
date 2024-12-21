document.addEventListener('DOMContentLoaded', function() {
  const pendingUsersList = document.getElementById('pendingUsersList');

  // Fetch pending users when the page loads
  fetchPendingUsers();
  fetchPendingSubscribers();

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

  // Fetch and display the list of pending subscribers
  async function fetchPendingSubscribers() {
    try {
      const response = await fetch('http://localhost:3000/api/pending-subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch pending subscribers');
      }
      const subscribers = await response.json();
      displayPendingSubscribers(subscribers);
    } catch (error) {
      console.error('Error fetching pending subscribers:', error);
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

  // Display the pending subscribers in the list
  function displayPendingSubscribers(subscribers) {
    pendingSubscribersList.innerHTML = ''; // Clear previous list
    if (subscribers.length === 0) {
      pendingSubscribersList.innerHTML = `<li>No pending subscribers at the moment.</li>`;
    } else {
      subscribers.forEach(subscriber => {
        const subscriberElement = createUserElement(subscriber, 'subscriber');
        pendingSubscribersList.appendChild(subscriberElement);
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
  async function handleAction(id, action, type) {
    const actionMessage = action === 'approve' ? 'approved' : 'rejected';
    const endpoint = type === 'user' ? `api/${action}-user/${id}` : `api/${action}-subscriber/${id}`;

    try {
      const response = await fetch(`http://localhost:3000/${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.message || 'Action completed successfully!'} ${actionMessage}.`);
        
        // Refresh the relevant list
        if (type === 'user') {
          fetchPendingUsers();
        } else {
          fetchPendingSubscribers();
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Error during the action');
      }
    } catch (error) {
      console.error(`Error during ${action} action:`, error);
      alert(`An unexpected error occurred while ${action} the ${type}.`);
    }
  }
});
