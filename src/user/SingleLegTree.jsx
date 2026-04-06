import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getMainContract } from "../utils/contract";
import { toast } from "react-toastify";


export default function SingleLegTree() {
    const { address, contracts } = useSelector((state) => state.wallet);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);

    const [visibleCount, setVisibleCount] = useState(5);

    const handleViewMore = () => {
        setVisibleCount((prev) => prev + 5);
    };

    useEffect(() => {
        if (address && contracts?.MAIN_CONTRACT) {
        loadPartners();
        }
    }, [address, contracts]);

    const loadPartners = async () => {
        try {
            setLoading(true);

            const main = await getMainContract(
            contracts.MAIN_CONTRACT
            );

            const exists = await main.isUserExists(address);

            if (!exists) {
            toast.error("User not found");
            setLoading(false);
            return;
            }

            const rootIndex = Number(await main.globalIndex(address));

            const addressPromises = [];

            for (let i = rootIndex; i < rootIndex + 24; i++) {
            addressPromises.push(
                main.globalUsers(i).catch(() => null)
            );
            }

            const addresses = await Promise.all(addressPromises);

            const userPromises = addresses.map(async (addr, idx) => {
            if (!addr) return null;

            try {
                const userData = await main.users(addr);
                console.log(userData)
                const totalStakedEth = Number(userData.totalCurrentStaked) / 1e18;
                const status = totalStakedEth > 1000 ? "Active" : "Inactive";
                return {
                level: idx + 1,
                address: addr,
                referralCode: userData.referralCode,
                status
                };
            } catch {
                return null;
            }
            });

            const results = await Promise.all(userPromises);

            const downlines = results.filter(Boolean);

            setPartners(downlines);
            setLoading(false);

        } catch (error) {
            console.error("Error loading partners:", error);
            toast.error("Error loading partners");
            setLoading(false);
        }
        };

    const visibleUsers = partners.slice(0, visibleCount);

    return (
        <div className="container py-4 text-center">



            <div className="row">
                <div className="col-md-12">
                    <div className="token-title newFont">
                        <h2 className="gradient-text">SINGLE LEG TREE</h2>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="timeline-container">

                <div className="timeline-line"></div>


                {loading ? (
                    <p>Loading tree...</p>
                    ) : visibleUsers.length === 0 ? (
                    <p>No downlines found</p>
                    ) : (visibleUsers.map((user) => (
                    <div key={user.address} className="timeline-item">

                        <div className="farms-single-section gradient-border stakeBg mini-theme-card">

                            <div className="mini-avatar">
                                <img
                                    // src={`https://i.pravatar.cc/100?img=${user.id}`}
                                    src={user.address
                                    ? "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                    alt="user"
                                />
                            </div>
                            {/* <div className="mini-id">
                                Level {user.level}
                            </div> */}

                            <div className="mini-id">
                                {user.referralCode}
                            </div>

                            <div className="mini-id">

                                {user.address.slice(0, 6)}...
                                {user.address.slice(-4)}
                            </div>
                            <div className="mini-id">
                            <strong className={user.status === "Active" ? "text-success" : "text-danger"}>
                                {user.status}
                            </strong>
                            </div>

                        </div>

                    </div>
                ))
                )}

            </div>

            {/* Button */}
            {visibleCount < partners.length && (
                <button
                    className="btn btn-warning mt-4 px-4 view-btn"
                    onClick={handleViewMore}
                >
                    View More
                </button>
            )}
        </div>
    );
}