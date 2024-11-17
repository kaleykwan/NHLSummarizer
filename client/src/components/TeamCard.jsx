import React from "react";
import "../styles/TeamCard.css"

const TeamCard = ({ team }) => {
  return (
    <div className="team-card">
      <img src={team.logo} width={100}/>
      <p>
        {team.placeName} {team.commonName}
      </p>
    </div>
  );
};
export default TeamCard;
