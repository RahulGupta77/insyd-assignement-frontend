"use client";

const UserProfile = ({ user, username }) => {
  // Check if the logged-in user matches the profile being viewed
  const isCurrentUser = user && user.username === username;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-purple-600 text-white rounded-full h-16 w-16 flex items-center justify-center text-xl font-bold">
          {username?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{username}</h1>
          {/* {user?.email && isCurrentUser && (
            <p className="text-gray-600">{user.email}</p>
          )} */}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

        {isCurrentUser ? (
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-gray-600">Username</p>
              <p className="font-medium">{user.username}</p>
            </div>
            {/* 
            {user.email && (
              <div className="border-b pb-4">
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            )} */}

            <div className="pt-4">
              <button className="btn btn-primary">Edit Profile</button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-100 p-6 rounded-md text-center">
            <p className="text-gray-600">This is {username}s public profile.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
