import { useState, useEffect } from "react";

const MAX_LEVEL = 24;
const STEP = 6;

function SingleLeg() {
const [visibleCount, setVisibleCount] = useState(6);
  const [users, setUsers] = useState([]);

  // 🔗 Fetch from blockchain (or API)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // 👉 Replace this with smart contract call
        // Example: contract.getSingleLeg(userAddress)

        const arr = [];

        for (let i = 0; i < MAX_LEVEL; i++) {
            if (i < 5) {
                arr.push({ level: i + 1, id: 123456 + i });
            } else {
                arr.push({ level: i + 1, id: null });
            }
        }

        setUsers(arr);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleViewMore = () => {
    setVisibleCount((prev) => Math.min(prev + STEP, MAX_LEVEL));
  };

  const visibleUsers = [];
  for (let user of users) {
    visibleUsers.push(user);
    if (!user.id) break;
  }

  return (
    <div className="singleleg-wrapper">
        <div className="title newFont">
            <h2 className="gradient-text">Single Leg Structure</h2>
        </div>

      <div className="tree">
        {/* You */}
        <div className="node root gradient-border">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="you"
          />
          <div className="info">
            <span>You</span><br />
            <b>ID:123456</b>
          </div>
        </div>

        {/* Levels */}
        {users.slice(0, visibleCount).map((user, index) => (
          <div key={index} className="node gradient-border">
            <div className="line"></div>

            <img
              src={
                user.id
                  ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="user"
            />

            <div className="info">
              <span>Level {user.level}</span><br />
              <b>{user.id ? `ID:${user.id}` : "Empty"}</b>
            </div>
          </div>
        ))}

        {/* View More */}
        {visibleCount < MAX_LEVEL && (
          <button className="view-more-btn" onClick={handleViewMore}>
            View More
          </button>
        )}
      </div>
    </div>
  );
}

export default SingleLeg;
