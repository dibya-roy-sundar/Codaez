import { forwardRef, useImperativeHandle, useRef } from "react";
import "./DetailModal.scss";

const DetailModal = forwardRef(({ details }, ref) => {
    const dialogRef = useRef();

    useImperativeHandle(ref, () => {
        return {
            openModal() {
                dialogRef.current.showModal();
            }
        }
    })

    return (
        <dialog className="detailModal" ref={dialogRef}>
            <div className="logo">
                <img src={details.logo} alt="" />
            </div>
            <div><div className="block">{details.username}</div></div>
            <div>Rating: {details.rating}</div>
            {details.maxRating && <div>Max Rating: {details.maxRating}</div>}
            <div>Rank: {details.rank}</div>
            {details.maxRank && <div>Max Rank: {details.maxRank}</div>}
            {details.countryRank && <div>Country Rank: {details.countryRank}</div>}
            {details.topPercentage && <div>Top Percentage: {details.topPercentage}</div>}
            {details.badge && <div>Badge: {details.badge}</div>}
            {details.attendedContestsCount && <div>Contests Attended: {details.attendedContestsCount}</div>}
            {details.stars && <div>Stars: {details.stars}</div>}
            <form method="dialog">
                <button className="btn">CLOSE</button>
            </form>
        </dialog>
    )
})

export default DetailModal;