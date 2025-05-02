"use client";

const UserProfile = ({ user, username }) => {
  // Check if the logged-in user matches the profile being viewed
  const isCurrentUser = user && user.username === username;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">{user.username}</div>
  );
};

export default UserProfile;
