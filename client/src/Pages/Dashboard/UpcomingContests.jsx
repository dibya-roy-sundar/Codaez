import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import noContestFound from "../../assets/noContestFound.png";
import upcoming from "../../assets/flaticon/upcoming.gif";
import leetcode from "../../assets/leetcode.png";
import codeforces from "../../assets/codeforces.png";
import codechef from "../../assets/codechef.png";
import { BiLinkExternal } from "react-icons/bi";

const UpcomingContests = ({ data }) => {
	const [activeContest, setActiveContest] = useState("allContests"); // Default to Codeforces
	const [contestData, setContestData] = useState([]);

	useEffect(() => {
		setContestData(data[`${activeContest}`]);
	}, [data, activeContest]);

	return (
		<div className="contests">
			<h2>Upcoming Contests</h2>
			<div className="contestButtonWrapper">
				<div
					className={`platformBtn ${
						activeContest === "allContests" ? "activeContest" : ""
					}`}
					onClick={() => setActiveContest("allContests")}
				>
					<img src={upcoming} alt="" />
					<span className="title">All Contests</span>
				</div>
				<div
					className={`platformBtn ${
						activeContest === "CfContests" ? "activeContest" : ""
					}`}
					onClick={() => setActiveContest("CfContests")}
				>
					<img src={codeforces} alt="" />
					<span className="title">CodeForces</span>
				</div>
				<div
					className={`platformBtn ${
						activeContest === "LcContests" ? "activeContest" : ""
					}`}
					onClick={() => setActiveContest("LcContests")}
				>
					<img src={leetcode} alt="" />
					<span className="title">LeetCode</span>
				</div>
				<div
					className={`platformBtn ${
						activeContest === "CcContests" ? "activeContest" : ""
					}`}
					onClick={() => setActiveContest("CcContests")}
				>
					<img src={codechef} alt="" />
					<span className="title">CodeChef</span>
				</div>
			</div>
			<div className="contestWrapper">
				{contestData?.length ? (
					contestData?.map((contest, index) => (
						<div className="eachContest" key={index}>
							<div className="logo">
								<img
									src={
										contest?.platform === "cf"
											? codeforces
											: contest?.platform === "lc"
											? leetcode
											: codechef
									}
									alt=""
								/>
							</div>
							<div className="heading">
								<span className="title">{contest?.title}</span>
								<span className="duration">
									Duration: {contest?.duration} hrs
								</span>
							</div>
							<div className="startTime">
								{new Date(contest?.startTime).toLocaleString(
									"en-US",
									{
										month: "long",
										day: "numeric",
										year: "numeric",
										hour: "numeric",
										minute: "numeric",
										hour12: false,
									}
								)}
							</div>
							<Link
								to={contest.url}
								target="_blank"
								rel="noopener noreferrer"
								className="viewBtn"
							>
								View <BiLinkExternal />
							</Link>
						</div>
					))
				) : (
					<div className="noContests">
						<img src={noContestFound} alt="" />
						<div className="contestNotFound">
							No contests for now or the server isn't responding
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UpcomingContests;
